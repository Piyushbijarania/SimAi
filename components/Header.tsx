import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-[52px] items-center justify-between border-b border-[var(--border)] bg-[var(--bg)] px-4 md:px-6">
      <Logo />
      {user ? <UserMenu user={user} /> : null}
    </header>
  );
}
