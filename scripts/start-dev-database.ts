import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const COMPOSE_FILE = "infrastructure/docker/docker-compose.dev.yml";
const DOCKER_START_TIMEOUT_SECONDS = readPositiveIntegerEnv(
  "DOCKER_START_TIMEOUT_SECONDS",
  120,
);
const DOCKER_POLL_INTERVAL_SECONDS = readPositiveIntegerEnv(
  "DOCKER_POLL_INTERVAL_SECONDS",
  2,
);

function readPositiveIntegerEnv(name: string, fallback: number): number {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function commandExists(command: string): boolean {
  const result =
    process.platform === "win32"
      ? spawnSync("where", [command], { stdio: "ignore" })
      : spawnSync("sh", ["-c", `command -v ${command}`], { stdio: "ignore" });

  return result.status === 0;
}

function run(
  command: string,
  args: string[],
  stdio: "ignore" | "inherit" = "ignore",
): boolean {
  const result = spawnSync(command, args, { stdio });
  return result.status === 0;
}

function getCommandOutput(command: string, args: string[]): string {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });

  return result.status === 0 ? result.stdout.trim() : "";
}

function dockerIsRunning(): boolean {
  return run("docker", ["info"]);
}

function isWsl(): boolean {
  if (process.platform !== "linux") {
    return false;
  }

  try {
    const osRelease = readFileSync("/proc/sys/kernel/osrelease", "utf8");
    return osRelease.toLowerCase().includes("microsoft");
  } catch {
    return false;
  }
}

function startDockerDesktopOnWindows(): boolean {
  const knownDockerDesktopPaths = [
    process.env.ProgramFiles
      ? join(process.env.ProgramFiles, "Docker", "Docker", "Docker Desktop.exe")
      : null,
    process.env.LOCALAPPDATA
      ? join(process.env.LOCALAPPDATA, "Docker", "Docker Desktop.exe")
      : null,
    process.env["ProgramFiles(x86)"]
      ? join(
          process.env["ProgramFiles(x86)"],
          "Docker",
          "Docker",
          "Docker Desktop.exe",
        )
      : null,
  ].filter((path): path is string => Boolean(path));

  for (const dockerDesktopPath of knownDockerDesktopPaths) {
    if (existsSync(dockerDesktopPath)) {
      const child = spawn(dockerDesktopPath, [], {
        detached: true,
        stdio: "ignore",
      });
      child.unref();
      return true;
    }
  }

  return run("powershell.exe", [
    "-NoProfile",
    "-Command",
    "Start-Process 'Docker Desktop'",
  ]);
}

function startDockerOnMacos(): void {
  const context = getCommandOutput("docker", ["context", "show"]);

  if (context.startsWith("colima") && commandExists("colima")) {
    console.log("Docker daemon is not running. Starting Colima...");
    if (run("colima", ["start"], "inherit")) {
      return;
    }
  }

  if (commandExists("open")) {
    console.log("Docker daemon is not running. Opening Docker Desktop...");
    if (run("open", ["-g", "-a", "Docker"])) {
      return;
    }
  }

  if (commandExists("colima")) {
    console.log("Docker daemon is not running. Starting Colima...");
    if (run("colima", ["start"], "inherit")) {
      return;
    }
  }

  console.error(
    "Docker daemon is not running, and Docker Desktop or Colima could not be started automatically.",
  );
  console.error(
    "Start Docker Desktop or run 'colima start', then rerun this command.",
  );
  process.exit(1);
}

function startDockerOnLinux(): void {
  if (isWsl() && commandExists("powershell.exe")) {
    console.log(
      "Docker daemon is not running. Opening Docker Desktop from WSL...",
    );
    if (startDockerDesktopOnWindows()) {
      return;
    }
  }

  if (commandExists("systemctl")) {
    console.log(
      "Docker daemon is not running. Trying to start the docker service...",
    );
    if (run("sudo", ["-n", "systemctl", "start", "docker"])) {
      return;
    }
  }

  if (commandExists("service")) {
    console.log(
      "Docker daemon is not running. Trying to start the docker service...",
    );
    if (run("sudo", ["-n", "service", "docker", "start"])) {
      return;
    }
  }

  console.error(
    "Docker daemon is not running, and it could not be started automatically.",
  );
  console.error("Start the docker service, then rerun this command.");
  process.exit(1);
}

function startDockerOnWindows(): void {
  console.log("Docker daemon is not running. Opening Docker Desktop...");

  if (startDockerDesktopOnWindows()) {
    return;
  }

  console.error(
    "Docker daemon is not running, and Docker Desktop could not be started automatically.",
  );
  console.error("Start Docker Desktop, then rerun this command.");
  process.exit(1);
}

function startDocker(): void {
  switch (process.platform) {
    case "darwin":
      startDockerOnMacos();
      return;
    case "linux":
      startDockerOnLinux();
      return;
    case "win32":
      startDockerOnWindows();
      return;
    default:
      console.error(
        "Docker daemon is not running. Start Docker, then rerun this command.",
      );
      process.exit(1);
  }
}

function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

async function waitForDocker(): Promise<void> {
  let waitedSeconds = 0;

  while (!dockerIsRunning()) {
    if (waitedSeconds >= DOCKER_START_TIMEOUT_SECONDS) {
      console.error(
        `Timed out after ${DOCKER_START_TIMEOUT_SECONDS}s waiting for Docker to start.`,
      );
      process.exit(1);
    }

    await sleep(DOCKER_POLL_INTERVAL_SECONDS);
    waitedSeconds += DOCKER_POLL_INTERVAL_SECONDS;
  }
}

function startCompose(): void {
  console.log("Docker is running. Starting development database services...");

  const child = spawn("docker", ["compose", "-f", COMPOSE_FILE, "up"], {
    stdio: "inherit",
  });

  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

  for (const signal of signals) {
    process.on(signal, () => {
      child.kill(signal);
    });
  }

  child.on("error", (error) => {
    console.error(`Failed to start Docker Compose: ${error.message}`);
    process.exit(1);
  });

  child.on("exit", (code) => {
    process.exit(code ?? 1);
  });
}

async function main(): Promise<void> {
  if (!commandExists("docker")) {
    console.error("Docker CLI is not installed or is not on PATH.");
    process.exit(1);
  }

  if (!dockerIsRunning()) {
    startDocker();
    await waitForDocker();
  }

  startCompose();
}

void main();
