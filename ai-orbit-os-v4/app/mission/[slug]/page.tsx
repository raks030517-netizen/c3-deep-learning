"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getPlanet, missions } from "../../../lib/missions";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export default function MissionDetailPage() {
  const params = useParams<{ slug: string }>();
  const mission = missions.find((item) => item.slug === params.slug);

  const [dropout, setDropout] = useState(mission?.experiment.dropout ?? 0.3);
  const [epochs, setEpochs] = useState(mission?.experiment.epochs ?? 30);
  const [complexity, setComplexity] = useState(mission?.experiment.complexity ?? 5);

  const result = useMemo(() => {
    const overfitPressure = complexity * 4 + epochs * 0.32 - dropout * 45;
    const tooMuchDropout = dropout > 0.65 ? (dropout - 0.65) * 90 : 0;
    const train = clamp(55 + complexity * 4 + epochs * 0.35 - dropout * 12, 35, 99);
    const validation = clamp(52 + complexity * 2.2 + epochs * 0.22 - Math.max(overfitPressure, 0) * 0.45 - tooMuchDropout, 25, 96);
    const generalization = clamp(100 - Math.abs(train - validation) * 2.4 - tooMuchDropout * 0.4, 5, 99);
    const risk = clamp(100 - generalization, 1, 99);
    return {
      train: Math.round(train),
      validation: Math.round(validation),
      generalization: Math.round(generalization),
      risk: Math.round(risk),
    };
  }, [dropout, epochs, complexity]);

  if (!mission) {
    return (
      <main className="app-shell">
        <div className="starfield" />
        <section className="page-hero container">
          <p className="eyebrow">MISSION NOT FOUND</p>
          <h1>해당 미션을 찾을 수 없습니다.</h1>
          <Link href="/mission" className="btn primary">미션 목록으로</Link>
        </section>
      </main>
    );
  }

  const planet = getPlanet(mission.planet);

  return (
    <main className={`app-shell mission-detail ${mission.planet}`}>
      <div className="starfield" />
      <div className="solar-dust" />

      <nav className="top-nav">
        <Link href="/" className="brand"><span className="brand-core" />AI ORBIT OS</Link>
        <div className="nav-links">
          <Link href="/academy">Academy</Link>
          <Link href="/galaxy">Galaxy</Link>
          <Link href="/mission">Mission</Link>
        </div>
      </nav>

      <section className="mission-detail-hero container">
        <div>
          <p className="eyebrow">{mission.code} / {mission.planetKo} / ORBIT {mission.orbit}</p>
          <h1>{mission.title}</h1>
          <p>{mission.desc}</p>
          <div className="hero-actions">
            <Link href="/mission" className="btn secondary">다른 미션 선택</Link>
            <Link href="/galaxy" className="btn secondary">궤도 지도 보기</Link>
          </div>
        </div>
        <div className="boss-card">
          <span className="mini-planet boss-planet" style={{ backgroundImage: `url(${planet.image})` }} />
          <span>THREAT</span>
          <h2>{mission.threat}</h2>
          <p>보상: {mission.reward}</p>
          <strong>{"★".repeat(mission.difficulty)}</strong>
        </div>
      </section>

      <section className="container mission-layout">
        <aside className="mission-sidebar">
          <h3>Mission Steps</h3>
          {mission.steps.map((step, index) => (
            <div className="step-item" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </div>
          ))}
        </aside>

        <div className="mission-content">
          <section className="glass-panel">
            <p className="eyebrow">CORE BRIEFING</p>
            <h2>핵심 개념</h2>
            <p className="big-text">{mission.summary}</p>
            <div className="analogy-box">
              <strong>직관 비유</strong>
              <p>{mission.analogy}</p>
            </div>
          </section>

          <section className="glass-panel">
            <p className="eyebrow">CONCEPT NODES</p>
            <h2>연결 개념</h2>
            <div className="chip-row large-chip">
              {mission.concepts.map((concept) => <span key={concept}>{concept}</span>)}
            </div>
          </section>

          <section className="glass-panel simulator">
            <p className="eyebrow">EXPERIMENT SIMULATOR</p>
            <h2>파라미터 조작 실험실</h2>
            <div className="control-grid">
              <label><span>Dropout Rate: {dropout.toFixed(2)}</span><input type="range" min="0" max="0.9" step="0.05" value={dropout} onChange={(e) => setDropout(Number(e.target.value))} /></label>
              <label><span>Epochs: {epochs}</span><input type="range" min="5" max="120" step="5" value={epochs} onChange={(e) => setEpochs(Number(e.target.value))} /></label>
              <label><span>Model Complexity: {complexity}</span><input type="range" min="1" max="10" step="1" value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} /></label>
            </div>
            <div className="result-grid">
              <Metric title="Train Accuracy" value={result.train} />
              <Metric title="Validation Accuracy" value={result.validation} />
              <Metric title="Generalization" value={result.generalization} />
              <Metric title="Overfitting Risk" value={result.risk} danger />
            </div>
            <div className="neuron-field">
              {Array.from({ length: 40 }).map((_, index) => (
                <span key={index} className={index / 40 < dropout ? "neuron off" : "neuron on"} />
              ))}
            </div>
            <div className="interpretation">
              <strong>AI 해석</strong>
              <p>Dropout이 낮고 Epoch와 모델 복잡도가 높으면 훈련 정확도는 올라가지만 검증 성능은 무너질 수 있습니다. 반대로 Dropout이 너무 높으면 뉴런을 지나치게 많이 꺼서 학습 자체가 약해질 수 있습니다.</p>
            </div>
          </section>

          <section className="glass-panel">
            <p className="eyebrow">CODE ROOM</p>
            <h2>핵심 코드</h2>
            <pre className="code-block"><code>{mission.codeSnippet}</code></pre>
          </section>

          <section className="glass-panel">
            <p className="eyebrow">REPORT GENERATOR</p>
            <h2>발표용 요약</h2>
            <div className="report-box">
              <p><strong>{mission.title}</strong> 미션에서는 {mission.summary}</p>
              <p>핵심 개념은 {mission.concepts.slice(0, 4).join(", ")}입니다.</p>
              <p>실험 결과는 훈련 성능만 보지 말고 검증 성능과 일반화 성능을 함께 해석해야 합니다.</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Metric({ title, value, danger }: { title: string; value: number; danger?: boolean }) {
  return (
    <div className={danger ? "metric danger" : "metric"}>
      <span>{title}</span>
      <strong>{value}%</strong>
      <div className="bar"><i style={{ width: `${value}%` }} /></div>
    </div>
  );
}
