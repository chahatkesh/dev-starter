"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/api/use-auth";

export function LogoutButton() {
  const { trigger, isLoading } = useLogout({
    onSuccess: () => {
      window.location.href =
        process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3001/login";
    },
  });

  return (
    <Button
      onClick={() => trigger(undefined as never)}
      variant="outline"
      disabled={isLoading}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
