export class AppStrings {
  static readonly brand = {
    name: "Dev Starter",
    description:
      "A production-focused Next.js starter with account signup, login, role-based redirects, and a seeded admin account.",
  } as const;

  static readonly creator = {
    attributionPrefix: "Built with Dev Starter by",
    portfolioLabel: "Portfolio",
    githubLabel: "GitHub",
    repoLabel: "Source",
  } as const;

  static readonly metadata = {
    appTitle: "Dev Starter",
    appDescription:
      "Production-focused Next.js dev starter with auth and admin seeding.",
  } as const;

  static readonly common = {
    productionAppEyebrow: "Production app",
    healthPathBadge: "/api/health",
  } as const;

  static readonly auth = {
    signInTitle: "Sign in",
    signInDescription: "Use your email and password to access the app.",
    signUpTitle: "Create account",
    signUpDescription: "Sign up for a standard user account.",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm password",
    signInAction: "Sign in",
    signingInAction: "Signing in...",
    createAccountAction: "Create account",
    creatingAccountAction: "Creating account...",
    signOutAction: "Sign out",
    needAccountPrompt: "Need an account?",
    haveAccountPrompt: "Already have an account?",
    goToRegisterAction: "Create one",
    goToLoginAction: "Sign in",
    genericError: "Something went wrong. Please try again.",
    signedInAsPrefix: "Signed in as",
  } as const;

  static readonly home = {
    eyebrow: "Open-source monorepo starter",
    headline: "Ship production apps from one repo.",
    subheadline:
      "Auth, Prisma, shared copy, and a production deploy path in one workspace.",
    highlights: ["Auth & roles", "Prisma package", "AppStrings", "Deploy"],
    stackItems: [
      "Next.js 16",
      "React 19",
      "Prisma 7",
      "Tailwind 4",
      "PostgreSQL",
      "Vitest",
    ],
    signInAction: "Sign in",
    createAccountAction: "Create account",
    routesTitle: "Routes",
    redirects: {
      usersLabel: "Public",
      usersValue: "/login · /signup",
      adminsLabel: "Admin",
      adminsValue: "/admin",
      standardUsersLabel: "Users",
      standardUsersValue: "/app",
    },
  } as const;

  static readonly appDashboard = {
    eyebrow: "App",
    title: "Your workspace",
    description:
      "This is the default destination for standard user accounts after login or signup.",
  } as const;

  static readonly adminDashboard = {
    eyebrow: "Admin",
    title: "Admin dashboard",
    descriptionPrefix: "Admin accounts are seeded from",
    descriptionConnector: "and",
    descriptionSuffix: "Standard signups always land on",
    adminEmailEnvKey: "ADMIN_EMAIL",
    adminPasswordEnvKey: "ADMIN_PASSWORD",
    standardUserPath: "/app",
  } as const;

  static readonly health = {
    statusOk: "ok",
  } as const;

  static readonly seed = {
    skipAdminSeed:
      "Skipping admin seed. Set ADMIN_EMAIL and ADMIN_PASSWORD to create the admin account.",
    seededAdminPrefix: "Seeded admin account:",
    completed: "Database seed completed.",
    failed: "Database seed failed.",
  } as const;

  static signedInAs(email: string) {
    return `${AppStrings.auth.signedInAsPrefix} ${email}`;
  }

  static seededAdminAccount(email: string) {
    return `${AppStrings.seed.seededAdminPrefix} ${email}`;
  }
}
