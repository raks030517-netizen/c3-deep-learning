"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const SolarSystem3D = dynamic(() => import("../components/SolarSystem3D"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="home3d">
      <div className="spaceBackdrop" />

      <nav className="nav3d">
        <Link href="/" className="logo3d">
          AI ORBIT OS
        </Link>

        <div className="menu3d">
          <Link href="/academy">Academy</Link>
          <Link href="/galaxy">Galaxy</Link>
          <Link href="/mission">Mission</Link>
        </div>
      </nav>

      <section className="hero3d">
        <div className="copy3d">
          <p>SOLAR SYSTEM LEARNING MAP</p>
          <h1>AI Orbit OS</h1>
          <span>Real-ratio orbit · rotation · living surface</span>

          <div className="actions3d">
            <Link href="/mission">Start</Link>
            <Link href="/galaxy">Galaxy Map</Link>
          </div>
        </div>

        <div className="canvasShell">
          <SolarSystem3D />
        </div>
      </section>
    </main>
  );
}