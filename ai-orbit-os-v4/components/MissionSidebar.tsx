import Link from "next/link";
import { missions } from "../lib/missions";

export default function MissionSidebar() {
  return (
    <aside className="side">
      <h2>MISSION INDEX</h2>

      {missions.map((m, i) => (
        <Link key={m.slug} href={`/mission/${m.slug}`}>
          <b>
            {String(i + 1).padStart(2, "0")} · {m.title}
          </b>
          <small>{m.subtitle}</small>
        </Link>
      ))}
    </aside>
  );
}