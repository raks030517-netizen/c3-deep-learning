import Link from "next/link";

export default function TopNav() {
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-dot" />
        AI ORBIT OS
      </Link>

      <nav className="nav">
        <Link href="/galaxy">Galaxy</Link>
        <Link href="/academy">Academy</Link>
        <Link href="/mission/classification">Missions</Link>
      </nav>
    </header>
  );
}