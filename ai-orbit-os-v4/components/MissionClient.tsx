"use client";

import { useMemo, useState } from "react";
import type { Mission } from "../lib/missions";

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function MissionClient({ mission }: { mission: Mission }) {
  const [a, setA] = useState(45);
  const [b, setB] = useState(35);
  const [c, setC] = useState(3);

  return (
    <div className="lab">
      <div className="panel">
        <Sim mission={mission} a={a} b={b} c={c} />
      </div>

      <aside className="panel console">
        <h3>{mission.title} Console</h3>
        <p>{mission.intuition}</p>

        <div className="control">
          <label>{mission.controls[0] ?? "Control A"} <span>{a}</span></label>
          <input type="range" min="0" max="100" value={a} onChange={(e) => setA(Number(e.target.value))} />
        </div>

        <div className="control">
          <label>{mission.controls[1] ?? "Control B"} <span>{b}</span></label>
          <input type="range" min="0" max="100" value={b} onChange={(e) => setB(Number(e.target.value))} />
        </div>

        <div className="control">
          <label>{mission.controls[2] ?? "Control C"} <span>{c}</span></label>
          <input type="range" min="1" max="10" value={c} onChange={(e) => setC(Number(e.target.value))} />
        </div>

        <div className="takeaways">
          <b>핵심 정리</b>
          <ul>
            {mission.takeaways.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Sim({ mission, a, b, c }: { mission: Mission; a: number; b: number; c: number }) {
  switch (mission.sim) {
    case "map":
      return <MapSim />;
    case "split":
      return <SplitSim train={a} dev={b} />;
    case "scale":
      return <ScaleSim scale={a} leakage={b > 50} />;
    case "knn":
      return <KnnSim k={c} shift={a} />;
    case "regression":
      return <RegressionSim degree={c} noise={b} />;
    case "gradient":
      return <GradientSim lr={a} start={b} steps={c} />;
    case "regularization":
      return <RegularizationSim alpha={a} lasso={b > 50} />;
    case "classification":
      return <ClassificationSim threshold={a} curve={b} />;
    case "metrics":
      return <MetricsSim threshold={a} imbalance={b} />;
    case "bias":
      return <BiasSim complexity={a} noise={b} />;
    case "tree":
      return <TreeSim depth={Math.min(3, Math.max(1, c))} />;
    case "forest":
      return <ForestSim trees={c} randomness={a} />;
    case "kmeans":
      return <KMeansSim k={Math.min(5, Math.max(2, c))} />;
    case "pca":
      return <PCASim rotate={a} compression={b} />;
    case "perceptron":
      return <PerceptronSim mode={b} layers={c} />;
    case "network":
      return <NetworkSim layers={c} neurons={Math.max(3, Math.floor(a / 10))} />;
    case "backprop":
      return <BackpropSim step={c} />;
    case "overfit":
      return <OverfitSim epoch={a} dropout={b} patience={c} />;
    case "cnn":
      return <CNNSim pos={Math.floor(a / 12)} filter={b} />;
    case "transfer":
      return <TransferSim freeze={a} fine={b} />;
    case "detection":
      return <DetectionSim confidence={a} box={b} />;
    case "rag":
      return <RagSim query={a} topk={c} />;
    default:
      return <MapSim />;
  }
}

function MapSim() {
  const nodes = [
    ["AI", 360, 90, "cyan"],
    ["ML", 210, 220, "green"],
    ["DL", 510, 220, "pink"],
    ["CNN", 420, 360, "yellow"],
    ["RAG", 590, 360, "pink"],
    ["K-Means", 130, 360, "cyan"],
  ];
  return (
    <svg viewBox="0 0 720 500" className="stage">
      {nodes.slice(1).map((n, i) => <line key={i} x1="360" y1="100" x2={Number(n[1])} y2={Number(n[2])} stroke="rgba(255,255,255,.25)" strokeWidth="3" />)}
      {nodes.map(([name, x, y, cls]) => (
        <g key={name}>
          <circle cx={Number(x)} cy={Number(y)} r="54" className={String(cls)} opacity=".9" />
          <text x={Number(x)} y={Number(y) + 5} textAnchor="middle" fill="#03101e" fontWeight="900">{name}</text>
        </g>
      ))}
    </svg>
  );
}

function SplitSim({ train, dev }: { train: number; dev: number }) {
  const t = clamp(train, 40, 80);
  const d = clamp(dev, 10, 30);
  const test = Math.max(5, 100 - t - d);
  const parts = [
    ["Train", t, "#42e8ff"],
    ["Dev", d, "#ffe66d"],
    ["Test", test, "#ff55d6"],
  ];
  let x = 40;
  return (
    <svg viewBox="0 0 720 500" className="stage">
      <text x="50" y="70" fill="white" fontSize="30" fontWeight="900">Data Split Pipeline</text>
      {parts.map(([label, val, color]) => {
        const width = Number(val) * 6;
        const old = x;
        x += width;
        return (
          <g key={label}>
            <rect x={old} y="190" width={width} height="120" rx="18" fill={String(color)} opacity=".85" />
            <text x={old + width / 2} y="250" textAnchor="middle" fill="#03101e" fontWeight="900">{label}</text>
            <text x={old + width / 2} y="280" textAnchor="middle" fill="#03101e" fontWeight="900">{val}%</text>
          </g>
        );
      })}
    </svg>
  );
}

function ScaleSim({ scale, leakage }: { scale: number; leakage: boolean }) {
  const heightWeight = 120 + scale * 2;
  return (
    <svg viewBox="0 0 720 500" className="stage">
      <text x="50" y="65" fill="white" fontSize="28" fontWeight="900">Scaling Distortion</text>
      <circle cx="150" cy="330" r="12" className="cyan" />
      <circle cx="270" cy="330" r="12" className="green" />
      <circle cx={150 + heightWeight} cy="170" r="12" className="pink" />
      <line x1="150" y1="330" x2="270" y2="330" stroke="#6dffad" strokeWidth="5" />
      <line x1="150" y1="330" x2={150 + heightWeight} y2="170" stroke="#ff55d6" strokeWidth="5" />
      <rect x="430" y="160" width="220" height="160" rx="24" fill={leakage ? "#ff7474" : "#42e8ff"} opacity=".85" />
      <text x="540" y="230" textAnchor="middle" fill="#03101e" fontWeight="900">{leakage ? "LEAKAGE ON" : "LEAKAGE OFF"}</text>
      <text x="540" y="265" textAnchor="middle" fill="#03101e" fontWeight="900">{leakage ? "가짜 성능 위험" : "정상 파이프라인"}</text>
    </svg>
  );
}

function KnnSim({ k, shift }: { k: number; shift: number }) {
  const dots = range(70).map((i) => {
    const x = 120 + ((i * 47) % 470);
    const y = 90 + ((i * 83) % 330);
    const dist = Math.hypot(x - (280 + shift), y - 250);
    return { x, y, label: x + y > 570 ? 1 : 0, near: dist < 30 + k * 14 };
  });
  return (
    <svg viewBox="0 0 720 500" className="stage">
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.near ? 11 : 7} className={d.label ? "cyan" : "pink"} opacity={d.near ? 1 : .45} />)}
      <circle cx={280 + shift} cy="250" r="18" fill="#ffe66d" />
      <circle cx={280 + shift} cy="250" r={30 + k * 14} fill="none" stroke="#ffe66d" strokeWidth="3" strokeDasharray="8 8" />
    </svg>
  );
}

function RegressionSim({ degree, noise }: { degree: number; noise: number }) {
  const pts = range(42).map((i) => {
    const x = i / 41;
    const y = .15 + .7 * x + Math.sin(x * Math.PI * 2) * .08 + Math.sin(i * 19) * noise / 600;
    return { x, y };
  });
  const yhat = (x: number) => .18 + .68 * x + Math.sin(x * Math.PI * 2.2) * degree * .025 + Math.sin(x * Math.PI * 10) * Math.max(0, degree - 5) * .013;
  return (
    <svg viewBox="0 0 720 500" className="stage">
      <polyline points={range(160).map((i) => { const x = i / 159; return `${x * 720},${500 - yhat(x) * 430}`; }).join(" ")} className="line" />
      {pts.map((p, i) => <circle key={i} cx={p.x * 720} cy={500 - p.y * 430} r="7" className="green" opacity=".9" />)}
    </svg>
  );
}

function GradientSim({ lr, start, steps }: { lr: number; start: number; steps: number }) {
  let x = (start - 50) / 16;
  const pts: {x:number,y:number}[] = [];
  for (let i = 0; i < steps * 4; i++) {
    const grad = 2 * x;
    x = x - (lr / 260) * grad;
    pts.push({ x, y: x * x });
  }
  return (
    <svg viewBox="0 0 720 500" className="stage">
      <polyline points={range(160).map((i) => { const x = -4 + i / 159 * 8; const y = x * x; return `${80 + (x + 4) * 70},${440 - y * 22}`; }).join(" ")} className="line" />
      {pts.map((p, i) => <circle key={i} cx={80 + (p.x + 4) * 70} cy={440 - p.y * 22} r={4 + i / 7} className={i === pts.length - 1 ? "yellow" : "pink"} opacity=".85" />)}
    </svg>
  );
}

function RegularizationSim({ alpha, lasso }: { alpha: number; lasso: boolean }) {
  const weights = range(10).map(i => Math.max(4, 90 - alpha * (lasso ? 1.2 : .7) - i * 4 + (i % 3) * 18));
  return (
    <svg viewBox="0 0 720 500" className="stage">
      <text x="50" y="65" fill="white" fontSize="28" fontWeight="900">{lasso ? "Lasso L1" : "Ridge L2"} Regularization</text>
      {weights.map((w, i) => (
        <g key={i}>
          <rect x={80 + i * 58} y={420 - w * 3} width="38" height={w * 3} rx="10" fill={lasso && w < 18 ? "#ff7474" : "#42e8ff"} />
          <text x={99 + i * 58} y="452" textAnchor="middle" fill="white" fontSize="12">w{i+1}</text>
        </g>
      ))}
    </svg>
  );
}

function ClassificationSim({ threshold, curve }: { threshold: number; curve: number }) {
  const dots = range(95).map((i) => {
    const x = ((i * 37) % 100) / 100;
    const y = ((i * 61) % 100) / 100;
    const boundary = .52 + Math.sin(x * Math.PI * 2) * (curve / 260);
    return { x, y, label: y > boundary ? 1 : 0 };
  });
  return (
    <svg viewBox="0 0 720 500" className="stage">
      <line x1="0" y1={threshold * 5} x2="720" y2={threshold * 5} stroke="#ffe66d" strokeWidth="4" strokeDasharray="12 8" />
      <path d={`M 0 260 C 140 ${260 - curve}, 260 ${160 + curve}, 370 245 S 580 ${300 - curve / 2}, 720 220`} className="line" />
      {dots.map((d, i) => <circle key={i} cx={d.x * 720} cy={d.y * 500} r="7" className={d.label ? "cyan" : "pink"} opacity=".95" />)}
    </svg>
  );
}

function MetricsSim({ threshold, imbalance }: { threshold: number; imbalance: number }) {
  const tp = Math.round(threshold * .6);
  const fp = Math.round((100 - threshold) * .35);
  const fn = Math.round(imbalance * .35);
  const tn = Math.max(10, 100 - tp - fp - fn);
  const cells = [["TP", tp, "#42e8ff"], ["FP", fp, "#ff7474"], ["FN", fn, "#ff55d6"], ["TN", tn, "#6dffad"]];
  return (
    <svg viewBox="0 0 720 500" className="stage">
      {cells.map(([label, val, color], i) => {
        const x = 170 + (i % 2) * 210;
        const y = 120 + Math.floor(i / 2) * 150;
        return <g key={label}><rect x={x} y={y} width="170" height="120" rx="22" fill={String(color)} opacity=".85"/><text x={x+85} y={y+50} textAnchor="middle" fill="#03101e" fontWeight="900" fontSize="28">{label}</text><text x={x+85} y={y+88} textAnchor="middle" fill="#03101e" fontWeight="900" fontSize="34">{val}</text></g>
      })}
    </svg>
  );
}

function BiasSim({ complexity, noise }: { complexity: number; noise: number }) {
  const train = clamp(35 + complexity * .65, 20, 98);
  const test = complexity < 70 ? clamp(30 + complexity * .7 - noise * .08, 15, 90) : clamp(115 - complexity - noise * .1, 8, 80);
  return <BarCompare title={complexity < 30 ? "High Bias" : complexity < 70 ? "Just Right" : "High Variance"} bars={[["Train", train], ["Test", test]]} />;
}

function TreeSim({ depth }: { depth: number }) {
  return (
    <svg viewBox="0 0 720 500" className="stage">
      <Node x={360} y={60} text="귀 모양?" />
      {depth >= 1 && <>
        <Edge x1={360} y1={100} x2={220} y2={180}/><Edge x1={360} y1={100} x2={500} y2={180}/>
        <Node x={220} y={190} text="얼굴 모양?" /><Node x={500} y={190} text="수염?" />
      </>}
      {depth >= 2 && <>
        {[130,300,430,590].map((x, i) => <g key={i}><Edge x1={i<2?220:500} y1={230} x2={x} y2={330}/><Node x={x} y={345} text={i%2===0?"CAT":"NOT"} small /></g>)}
      </>}
    </svg>
  );
}

function ForestSim({ trees, randomness }: { trees: number; randomness: number }) {
  return (
    <svg viewBox="0 0 720 500" className="stage">
      {range(trees).map((i) => {
        const x = 70 + i * 60;
        const h = 130 + ((i * 29 + randomness) % 90);
        return <g key={i}><rect x={x} y={340-h} width="40" height={h} rx="14" fill={i%2 ? "#42e8ff" : "#6dffad"} opacity=".85"/><circle cx={x+20} cy={330-h} r="28" fill={i%2 ? "#42e8ff" : "#6dffad"} opacity=".8"/></g>
      })}
      <text x="360" y="440" textAnchor="middle" fill="white" fontWeight="900" fontSize="30">VOTE / AVERAGE</text>
    </svg>
  );
}

function KMeansSim({ k }: { k: number }) {
  const classes = ["cyan", "pink", "green", "yellow", "cyan"];
  const pts = range(130).map((i) => {
    const group = i % k;
    const angle = Math.PI * 2 * group / k;
    const cx = 360 + Math.cos(angle) * 170;
    const cy = 250 + Math.sin(angle) * 130;
    return { x: cx + Math.sin(i * 17) * 48, y: cy + Math.cos(i * 29) * 42, group };
  });
  return (
    <svg viewBox="0 0 720 500" className="stage">
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="7" className={classes[p.group]} opacity=".9" />)}
      {range(k).map((i) => { const angle = Math.PI * 2 * i / k; return <circle key={i} cx={360+Math.cos(angle)*170} cy={250+Math.sin(angle)*130} r="18" fill="none" stroke="#fff" strokeWidth="4"/> })}
    </svg>
  );
}

function PCASim({ rotate, compression }: { rotate: number; compression: number }) {
  const pts = range(80).map((i) => {
    const t = i / 79 * Math.PI * 2;
    const r = 120 + Math.sin(i * 7) * 35;
    const x = 360 + Math.cos(t + rotate/50) * r;
    const y = 250 + Math.sin(t + rotate/80) * r * (1 - compression/180);
    return {x,y};
  });
  return (
    <svg viewBox="0 0 720 500" className="stage">
      <line x1="120" y1="250" x2="600" y2="250" stroke="#ffe66d" strokeWidth="5" />
      <line x1="360" y1="80" x2="360" y2="420" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="7" className="cyan" opacity=".85"/>)}
      <text x="360" y="455" textAnchor="middle" fill="white" fontWeight="900">PC1: 최대 분산 방향</text>
    </svg>
  );
}

function PerceptronSim({ mode, layers }: { mode: number; layers: number }) {
  const xor = mode > 50;
  return (
    <svg viewBox="0 0 720 500" className="stage">
      {[ [180,160,0], [180,340, xor?1:0], [540,160, xor?1:0], [540,340,1] ].map(([x,y,l],i)=><circle key={i} cx={x} cy={y} r="42" className={l?"cyan":"pink"} />)}
      <path d={xor && layers > 1 ? "M 80 250 C 220 90, 500 410, 640 250" : "M 120 380 L 620 120"} className="line" />
      <text x="360" y="455" textAnchor="middle" fill="white" fontWeight="900">{xor ? "XOR: 층이 필요함" : "AND/OR: 직선 가능"}</text>
    </svg>
  );
}

function NetworkSim({ layers, neurons }: { layers: number; neurons: number }) {
  const layout = [4, ...range(Math.min(6, layers)).map(()=>Math.max(3, Math.min(9, neurons))), 3];
  return (
    <div className="nn-stage">
      {layout.map((count, li)=><div className="nn-layer" key={li}>{range(count).map((_,ni)=><span key={ni} className="neuron" style={{animationDelay:`${(li+ni)*.07}s`}}/>)}</div>)}
    </div>
  );
}

function BackpropSim({ step }: { step: number }) {
  const layout = [4,6,5,3];
  return (
    <div className="nn-stage">
      {layout.map((count, li)=><div className="nn-layer" key={li}>{range(count).map((_,ni)=><span key={ni} className="neuron" style={{background:li>=layout.length-1-step?"#ff55d6":"#42e8ff", boxShadow:li>=layout.length-1-step?"0 0 24px #ff55d6":"0 0 24px #42e8ff"}}/>)}</div>)}
    </div>
  );
}

function OverfitSim({ epoch, dropout, patience }: { epoch: number; dropout: number; patience: number }) {
  const train = clamp(40 + epoch * .58, 20, 99);
  const val = epoch < 65 ? clamp(38 + epoch * .55, 20, 90) : clamp(125 - epoch - dropout * .12 + patience, 20, 88);
  return <BarCompare title="Learning Curve" bars={[["Train Acc", train], ["Val Acc", val], ["Dropout", dropout]]} />;
}

function CNNSim({ pos, filter }: { pos: number; filter: number }) {
  return (
    <div className="pixel">
      {range(64).map((i)=><span key={i} style={{opacity:.22+((i*17+pos*9+filter)%76)/100}}/>)}
      <div className="filter" style={{left:`${pos*28}px`}}>3×3<br/>FILTER</div>
    </div>
  );
}

function TransferSim({ freeze, fine }: { freeze: number; fine: number }) {
  return (
    <svg viewBox="0 0 720 500" className="stage">
      {["MobileNet Base", "Frozen Layers", "New Head", "Fine-Tune"].map((t,i)=><g key={t}><rect x={80+i*155} y={180} width="125" height="120" rx="24" fill={i===1&&freeze>50?"#42e8ff":i===3&&fine>50?"#ff55d6":"rgba(255,255,255,.12)"} stroke="#fff"/><text x={142+i*155} y="245" textAnchor="middle" fill="white" fontWeight="900">{t}</text></g>)}
      <text x="360" y="390" textAnchor="middle" fill="white" fontWeight="900">Pretrained Features → Custom Classifier</text>
    </svg>
  );
}

function DetectionSim({ confidence, box }: { confidence: number; box: number }) {
  const x = 160 + box * 3;
  return (
    <svg viewBox="0 0 720 500" className="stage">
      <rect x="100" y="80" width="520" height="340" rx="28" fill="rgba(255,255,255,.08)" />
      <circle cx="260" cy="240" r="90" fill="#42e8ff" opacity=".35" />
      <rect x={x} y="150" width="210" height="170" fill="none" stroke="#ffe66d" strokeWidth="6" />
      <text x={x} y="138" fill="#ffe66d" fontWeight="900">object {confidence}%</text>
      <text x="360" y="455" textAnchor="middle" fill="white" fontWeight="900">Classification + Localization</text>
    </svg>
  );
}

function RagSim({ query, topk }: { query: number; topk: number }) {
  const docs: [string, number][] = [["CNN 필터 특징",20],["RAG 검색 문서",60],["트리 앙상블",35],["Transformer 토큰",75],["PCA 차원축소",45]];
  return (
    <div>
      <div className="token-row">
        {["질문","→","Embedding","→","Vector Search","→","Context","→","Answer"].map(t=><span key={t} className="token">{t}</span>)}
      </div>
      <div>
        {docs.map(([text, base], i)=> {
          const score = Math.max(8, 100 - Math.abs(query - base) * 1.6);
          return <div key={text} className="bar-item" style={{opacity:i<topk ? 1 : .35}}><b>{text}</b><span className="bar-track"><i className="bar-fill" style={{width:`${score}%`}} /></span><em>{score.toFixed(0)}%</em></div>
        })}
      </div>
    </div>
  );
}

function BarCompare({ title, bars }: { title: string; bars: [string, number][] }) {
  return (
    <svg viewBox="0 0 720 500" className="stage">
      <text x="50" y="70" fill="white" fontSize="30" fontWeight="900">{title}</text>
      {bars.map(([label, val], i)=><g key={label}><rect x={120+i*170} y={420-val*3} width="90" height={val*3} rx="16" fill={i===0?"#42e8ff":i===1?"#ff55d6":"#ffe66d"} /><text x={165+i*170} y="455" textAnchor="middle" fill="white" fontWeight="900">{label}</text><text x={165+i*170} y={400-val*3} textAnchor="middle" fill="white" fontWeight="900">{Math.round(val)}%</text></g>)}
    </svg>
  );
}

function Node({x,y,text,small=false}:{x:number;y:number;text:string;small?:boolean}) {
  return <g><rect x={x-(small?55:85)} y={y} width={small?110:170} height={small?58:64} rx="16" fill="rgba(255,255,255,.08)" stroke="#42e8ff"/><text x={x} y={y+(small?36:40)} textAnchor="middle" fill="white" fontWeight="900">{text}</text></g>
}

function Edge({x1,y1,x2,y2}:{x1:number;y1:number;x2:number;y2:number}) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffe66d" strokeWidth="3" />;
}
