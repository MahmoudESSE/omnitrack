import Link from "next/link";

const GroupSideBar = () => {
  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      <h2 className="text-xl font-semibold">General</h2>
      <Link href="/group/members">Members</Link>
    </nav>
  );
};

export default GroupSideBar;
