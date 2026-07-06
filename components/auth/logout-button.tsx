import { signOutAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { AppStrings } from "@shared/app-strings";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="secondary-dark">
        {AppStrings.auth.signOutAction}
      </Button>
    </form>
  );
}
