import TopNav from "./TopNav";
import MissionSidebar from "./MissionSidebar";

export default function MissionShell({
  kicker,
  title,
  desc,
  children,
}: {
  kicker: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <main className="app">
      <TopNav />

      <div className="container mission-layout">
        <MissionSidebar />

        <section className="main">
          <span className="kicker">{kicker}</span>
          <h1>{title}</h1>
          <p>{desc}</p>
          {children}
        </section>
      </div>
    </main>
  );
}