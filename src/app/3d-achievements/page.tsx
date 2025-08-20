"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Instances, Instance } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";

type Milestone = {
  id: string;
  date: string;
  title: string;
  description: string;
  category: "awards" | "press" | "milestone" | "collab";
};

const milestones: Milestone[] = [
  { id: "m-2025-01", date: "2025-01-20", title: "Summit Shortlist", description: "Top UGC shortlist.", category: "awards" },
  { id: "m-2024-11", date: "2024-11-02", title: "100K Views", description: "Crossed 100k organic views.", category: "milestone" },
  { id: "m-2024-08", date: "2024-08-16", title: "Feature", description: "Featured creator.", category: "press" },
  { id: "m-2024-05", date: "2024-05-01", title: "10 Collabs", description: "10+ paid collaborations.", category: "collab" },
];

function useSplinePoints(count = 80) {
  return useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const x = (t - 0.5) * 24;
      const z = Math.sin(t * Math.PI * 2) * 6 + Math.sin(t * Math.PI * 4) * 2;
      const y = Math.cos(t * Math.PI * 1.5) * 2 + 1.5;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.05);
    return curve;
  }, [count]);
}

function Road({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 200, 0.15, 16, false), [curve]);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#1c1c1c", roughness: 0.9, metalness: 0.1 }), []);
  return <mesh geometry={tube} material={mat} />;
}

function MilestoneNode({ curve, t, data, onFocus }: { curve: THREE.CatmullRomCurve3; t: number; data: Milestone; onFocus: (id: string) => void }) {
  const ref = useRef<THREE.Object3D>(null);
  const pos = curve.getPoint(t);
  const normal = curve.getTangent(t).normalize();
  // Offset slightly from the road to be visible
  const side = new THREE.Vector3().crossVectors(normal, new THREE.Vector3(0, 1, 0)).normalize();
  const p = pos.clone().add(side.multiplyScalar(0.5));

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current.scale, { x: 0.5, y: 0.5, z: 0.5 }, { x: 1, y: 1, z: 1, duration: 0.8, ease: "power2.out" });
  }, []);

  return (
    <group position={[p.x, p.y, p.z]}>
      <Instance
        ref={ref as any}
        scale={1}
        onClick={() => onFocus(data.id)}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      />
      <Html position={[0, 0.6, 0]} center className="px-2 py-1 rounded-md bg-black/70 text-white text-[11px] backdrop-blur-md border border-white/10 hidden sm:block">
        {new Date(data.date).toLocaleDateString(undefined, { year: "numeric", month: "short" })} • {data.title}
      </Html>
    </group>
  );
}

function Rig({ curve, activeId, tRef, playing }: { curve: THREE.CatmullRomCurve3; activeId?: string | null; tRef: React.MutableRefObject<number>; playing: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    if (playing) tRef.current = (tRef.current + delta * 0.025) % 1;
    const p = curve.getPoint(tRef.current);
    const lookAt = curve.getPoint((tRef.current + 0.01) % 1);
    group.current.position.lerp(p, 0.2);
    group.current.lookAt(lookAt);
  });
  return <group ref={group} />;
}

export default function ThreeDAchievementsPage() {
  const curve = useSplinePoints();
  const [active, setActive] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [categories, setCategories] = useState<Record<Milestone["category"], boolean>>({ awards: true, press: true, milestone: true, collab: true });
  const tRef = useRef(0);

  useEffect(() => {
    const url = new URL(window.location.href);
    const m = url.searchParams.get("m");
    if (m) setActive(m);
  }, []);

  useEffect(() => {
    if (!active) return;
    const idx = milestones.findIndex((m) => m.id === active);
    if (idx >= 0) {
      const t = (idx + 1) / (milestones.length + 1);
      gsap.to(tRef, { current: t, duration: 1, ease: "power2.out" });
    }
  }, [active]);

  const visibleMilestones = useMemo(() =>
    milestones.filter(m => categories[m.category] && (filter === "" || `${m.title} ${m.description}`.toLowerCase().includes(filter.toLowerCase()))),
    [categories, filter]
  );

  return (
    <div className="min-h-screen bg-black">
      <header className="mx-auto max-w-5xl px-6 sm:px-8 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">3D Achievements</h1>
            <p className="text-gray-400 text-sm">Interactive roadmap & timeline</p>
          </div>
          <div className="flex items-center gap-2">
            <input aria-label="Search milestones" placeholder="Search" className="hidden sm:block h-9 w-40 rounded-md bg-white/5 border border-white/10 px-2 text-sm text-white/90 placeholder:text-white/40" value={filter} onChange={(e) => setFilter(e.target.value)} />
            <button onClick={() => setPlaying((p) => !p)} aria-pressed={!playing} className="px-3 py-1.5 rounded-md border border-white/10 text-white/90 hover:bg-white/10 transition">{playing ? "Pause" : "Play"}</button>
            <button onClick={() => setShowList((v) => !v)} className="px-3 py-1.5 rounded-md border border-white/10 text-white/90 hover:bg-white/10 transition">{showList ? "3D" : "List"}</button>
          </div>
        </div>
        {/* Category toggles */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {(["awards","press","milestone","collab"] as Milestone["category"][]).map(c => (
            <label key={c} className={`px-2 py-1 rounded-md border ${categories[c] ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-transparent text-white/60"}`}>
              <input aria-label={`toggle ${c}`} type="checkbox" checked={categories[c]} onChange={(e)=> setCategories(prev => ({...prev, [c]: e.target.checked}))} className="mr-1 align-middle" />{c}
            </label>
          ))}
        </div>
      </header>

      {!showList ? (
        <div className="h-[70vh] sm:h-[72vh] lg:h-[76vh] max-w-[110rem] mx-auto rounded-xl overflow-hidden border border-white/10">
          <Canvas camera={{ position: [0, 3, 10], fov: 45 }} dpr={[1, 1.5]}>
            <color attach="background" args={["#000"]} />
            <Suspense fallback={null}>
              <Environment preset="city" environmentIntensity={0.35} />
              <group position={[0, 0, 0]}>
                <Road curve={curve} />
                <Instances limit={256} range={100} geometry={new THREE.SphereGeometry(0.22, 16, 16)}>
                  <meshStandardMaterial metalness={0.6} roughness={0.3} color="#ffffff" />
                  {visibleMilestones.map((m, i) => (
                    <MilestoneNode key={m.id} curve={curve} t={(i + 1) / (visibleMilestones.length + 1)} data={m} onFocus={(id) => setActive(id)} />
                  ))}
                </Instances>
              </group>
              <Rig curve={curve} activeId={active} tRef={tRef} playing={playing} />
            </Suspense>
            <directionalLight position={[5, 10, 5]} intensity={1.2} />
            <ambientLight intensity={0.15} />
            <OrbitControls enablePan={false} enableZoom={true} maxDistance={24} minDistance={6} />
          </Canvas>
          {/* Scrubber */}
          <div className="px-4 py-3 bg-black/60 border-t border-white/10 flex items-center gap-3">
            <label className="text-xs text-white/60">Time</label>
            <input aria-label="Timeline position" type="range" min={0} max={1000} value={Math.floor((tRef.current || 0) * 1000)} onChange={(e)=>{ tRef.current = Number(e.target.value)/1000; }} className="flex-1" />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl px-6 sm:px-8 pb-16">
          <ul className="space-y-4">
            {visibleMilestones.map((m) => (
              <li key={m.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400">{new Date(m.date).toLocaleDateString()}</div>
                <div className="text-white font-semibold">{m.title}</div>
                <div className="text-gray-300 text-sm">{m.description}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detail overlay */}
      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", damping: 22, stiffness: 200 }} className="w-full max-w-xl sm:max-w-2xl bg-white/10 border border-white/15 rounded-2xl p-5 sm:p-6 text-white">
              {(() => { const m = milestones.find(x => x.id === active)!; return (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-white/70">{new Date(m.date).toLocaleDateString(undefined,{year:"numeric", month:"short", day:"2-digit"})}</div>
                      <h3 className="text-lg sm:text-xl font-semibold">{m.title}</h3>
                    </div>
                    <button onClick={() => setActive(null)} className="px-2 py-1 rounded-md border border-white/15 hover:bg-white/10">Close</button>
                  </div>
                  <p className="mt-3 text-sm text-white/80">{m.description}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <button onClick={() => { const url = new URL(window.location.href); url.searchParams.set("m", m.id); navigator.clipboard.writeText(url.toString()); }} className="px-3 py-1.5 rounded-md border border-white/15 hover:bg-white/10 text-sm">Copy share link</button>
                    <a href={`/3d-achievements?m=${m.id}`} className="px-3 py-1.5 rounded-md border border-white/15 hover:bg-white/10 text-sm">Open route</a>
                  </div>
                </div>
              )})()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


