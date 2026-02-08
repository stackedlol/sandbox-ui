"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════ */
/* ── TYPES ───────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

interface FlowNode {
  id: string;
  x: number;
  y: number;
  label: string;
  sub?: string;
  color: string;
  icon?: string;
  w: number;
  h: number;
  inputs?: string[];
  outputs?: string[];
}

interface FlowEdge {
  id: string;
  from: string;
  fromPort: "out";
  to: string;
  toPort: "in";
  animated?: boolean;
}

type HistoryEntry = { nodes: FlowNode[]; edges: FlowEdge[] };

const GRID = 20;
const snap = (v: number) => Math.round(v / GRID) * GRID;

/* ═══════════════════════════════════════════════════════════════ */
/* ── PALETTE ─────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

const PALETTE = [
  { label: "Source", sub: "input", color: "var(--pastel-pink)", icon: "☞" },
  { label: "Process", sub: "transform", color: "var(--pastel-green)", icon: "⇄" },
  { label: "Store", sub: "state", color: "var(--pastel-blue)", icon: "◆" },
  { label: "Output", sub: "render", color: "var(--pastel-yellow)", icon: "◻" },
  { label: "Effect", sub: "side-effect", color: "var(--pastel-orange)", icon: "⚡" },
  { label: "Guard", sub: "validate", color: "var(--pastel-purple)", icon: "✓" },
];

/* ═══════════════════════════════════════════════════════════════ */
/* ── INITIAL DATA ────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

const INITIAL_NODES: FlowNode[] = [
  // Input layer
  { id: "user-input", x: 60, y: 60, label: "User Input", sub: "event listener", color: "var(--pastel-pink)", icon: "☞", w: 200, h: 80, outputs: ["out"] },
  { id: "api-data", x: 60, y: 240, label: "API Data", sub: "fetch / REST", color: "var(--pastel-blue)", icon: "↗", w: 200, h: 80, outputs: ["out"] },
  { id: "local-store", x: 60, y: 420, label: "Local Storage", sub: "persist", color: "var(--pastel-yellow)", icon: "⧫", w: 200, h: 80, outputs: ["out"] },
  // Process layer
  { id: "validator", x: 400, y: 60, label: "Validator", sub: "zod / yup", color: "var(--pastel-green)", icon: "✓", w: 200, h: 80, inputs: ["in"], outputs: ["out"] },
  { id: "transformer", x: 400, y: 240, label: "Transformer", sub: "normalize", color: "var(--pastel-purple)", icon: "⇄", w: 200, h: 80, inputs: ["in"], outputs: ["out"] },
  { id: "cache", x: 400, y: 420, label: "Cache Layer", sub: "SWR / memo", color: "var(--pastel-orange)", icon: "◈", w: 200, h: 80, inputs: ["in"], outputs: ["out"] },
  // State layer
  { id: "store", x: 740, y: 140, label: "State Store", sub: "zustand / redux", color: "var(--pastel-blue)", icon: "◆", w: 210, h: 84, inputs: ["in"], outputs: ["out"] },
  { id: "context", x: 740, y: 360, label: "React Context", sub: "provider tree", color: "var(--pastel-purple)", icon: "◎", w: 210, h: 84, inputs: ["in"], outputs: ["out"] },
  // Output layer
  { id: "ui-render", x: 1100, y: 80, label: "UI Render", sub: "virtual DOM", color: "var(--pastel-green)", icon: "◻", w: 200, h: 80, inputs: ["in"] },
  { id: "side-effect", x: 1100, y: 260, label: "Side Effects", sub: "useEffect", color: "var(--pastel-yellow)", icon: "⚡", w: 200, h: 80, inputs: ["in"] },
  { id: "analytics", x: 1100, y: 440, label: "Analytics", sub: "track events", color: "var(--pastel-pink)", icon: "◐", w: 200, h: 80, inputs: ["in"] },
];

const INITIAL_EDGES: FlowEdge[] = [
  { id: "e1", from: "user-input", fromPort: "out", to: "validator", toPort: "in", animated: true },
  { id: "e2", from: "api-data", fromPort: "out", to: "transformer", toPort: "in", animated: true },
  { id: "e3", from: "local-store", fromPort: "out", to: "cache", toPort: "in" },
  { id: "e4", from: "validator", fromPort: "out", to: "store", toPort: "in", animated: true },
  { id: "e5", from: "transformer", fromPort: "out", to: "store", toPort: "in", animated: true },
  { id: "e6", from: "cache", fromPort: "out", to: "context", toPort: "in" },
  { id: "e7", from: "transformer", fromPort: "out", to: "context", toPort: "in" },
  { id: "e8", from: "store", fromPort: "out", to: "ui-render", toPort: "in", animated: true },
  { id: "e9", from: "store", fromPort: "out", to: "side-effect", toPort: "in" },
  { id: "e10", from: "context", fromPort: "out", to: "ui-render", toPort: "in" },
  { id: "e11", from: "context", fromPort: "out", to: "analytics", toPort: "in" },
  { id: "e12", from: "side-effect", fromPort: "out", to: "analytics", toPort: "in" },
];

/* ═══════════════════════════════════════════════════════════════ */
/* ── HELPERS ─────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

function getPortPos(node: FlowNode, port: "in" | "out") {
  if (port === "in") return { x: node.x, y: node.y + node.h / 2 };
  return { x: node.x + node.w, y: node.y + node.h / 2 };
}

function edgePath(x0: number, y0: number, x1: number, y1: number) {
  const dx = Math.abs(x1 - x0) * 0.5;
  return `M ${x0} ${y0} C ${x0 + dx} ${y0}, ${x1 - dx} ${y1}, ${x1} ${y1}`;
}

let _nodeCounter = 100;
function nextId() { return `node-${++_nodeCounter}`; }
let _edgeCounter = 100;
function nextEdgeId() { return `edge-${++_edgeCounter}`; }

/* ═══════════════════════════════════════════════════════════════ */
/* ── FLOW CANVAS ─────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

function FlowCanvas() {
  const [nodes, setNodes] = useState<FlowNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<FlowEdge[]>(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [palettePos, setPalettePos] = useState({ x: 0, y: 0 });
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Wire drawing
  const [wiring, setWiring] = useState<{ fromId: string; mouseX: number; mouseY: number } | null>(null);
  const [wireTarget, setWireTarget] = useState<string | null>(null);

  // Undo/redo
  const [history, setHistory] = useState<HistoryEntry[]>([{ nodes: INITIAL_NODES, edges: INITIAL_EDGES }]);
  const [histIdx, setHistIdx] = useState(0);

  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const dragStart = useRef({ x: 0, y: 0, nodeX: 0, nodeY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  /* ── Push undo state ──────────────────────── */
  const pushHistory = useCallback((n: FlowNode[], e: FlowEdge[]) => {
    setHistory((h) => {
      const newH = h.slice(0, histIdx + 1);
      newH.push({ nodes: n, edges: e });
      return newH;
    });
    setHistIdx((i) => i + 1);
  }, [histIdx]);

  const undo = useCallback(() => {
    if (histIdx <= 0) return;
    const prev = history[histIdx - 1];
    setNodes(prev.nodes);
    setEdges(prev.edges);
    setHistIdx((i) => i - 1);
  }, [histIdx, history]);

  const redo = useCallback(() => {
    if (histIdx >= history.length - 1) return;
    const next = history[histIdx + 1];
    setNodes(next.nodes);
    setEdges(next.edges);
    setHistIdx((i) => i + 1);
  }, [histIdx, history]);

  // Connected node IDs for selected
  const connectedIds = useMemo(() => {
    const s = new Set<string>();
    if (selectedNode) {
      s.add(selectedNode);
      edges.forEach((e) => {
        if (e.from === selectedNode) s.add(e.to);
        if (e.to === selectedNode) s.add(e.from);
      });
    }
    if (selectedEdge) {
      const edge = edges.find((e) => e.id === selectedEdge);
      if (edge) { s.add(edge.from); s.add(edge.to); }
    }
    return s;
  }, [selectedNode, selectedEdge, edges]);

  /* ── Convert client coords to canvas coords ── */
  const clientToCanvas = useCallback((cx: number, cy: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: cx, y: cy };
    return {
      x: (cx - rect.left - pan.x) / zoom,
      y: (cy - rect.top - pan.y) / zoom,
    };
  }, [pan, zoom]);

  /* ── Drag logic ─────────────────────────────── */
  const onNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodeMap.get(nodeId);
    if (!node) return;
    setDragging(nodeId);
    setSelectedNode(nodeId);
    setSelectedEdge(null);
    setShowPalette(false);
    dragStart.current = { x: e.clientX, y: e.clientY, nodeX: node.x, nodeY: node.y };
  }, [nodeMap]);

  const onCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest("[data-canvas-bg]")) {
      setSelectedNode(null);
      setSelectedEdge(null);
      setShowPalette(false);
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    }
  }, [pan]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (wiring) {
      setWiring((w) => w ? { ...w, mouseX: e.clientX, mouseY: e.clientY } : null);
      return;
    }
    if (dragging) {
      const dx = (e.clientX - dragStart.current.x) / zoom;
      const dy = (e.clientY - dragStart.current.y) / zoom;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === dragging
            ? { ...n, x: snap(dragStart.current.nodeX + dx), y: snap(dragStart.current.nodeY + dy) }
            : n
        )
      );
    } else if (isPanning) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setPan({ x: panStart.current.panX + dx, y: panStart.current.panY + dy });
    }
  }, [dragging, isPanning, zoom, wiring]);

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    if (wiring) {
      // Check if we're over an input port
      if (wireTarget) {
        const fromNode = nodeMap.get(wiring.fromId);
        const toNode = nodeMap.get(wireTarget);
        if (fromNode && toNode && toNode.inputs && wiring.fromId !== wireTarget) {
          // Check no duplicate edge
          const exists = edges.some((ed) => ed.from === wiring.fromId && ed.to === wireTarget);
          if (!exists) {
            const newEdge: FlowEdge = {
              id: nextEdgeId(),
              from: wiring.fromId,
              fromPort: "out",
              to: wireTarget,
              toPort: "in",
              animated: true,
            };
            const newEdges = [...edges, newEdge];
            setEdges(newEdges);
            pushHistory(nodes, newEdges);
          }
        }
      }
      setWiring(null);
      setWireTarget(null);
      return;
    }
    if (dragging) {
      // Push to undo stack after drag
      pushHistory(nodes, edges);
    }
    setDragging(null);
    setIsPanning(false);
  }, [wiring, wireTarget, dragging, nodes, edges, nodeMap, pushHistory]);

  /* ── Wire from port ────────────────────────── */
  const onOutputPortDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setWiring({ fromId: nodeId, mouseX: e.clientX, mouseY: e.clientY });
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  const onInputPortEnter = useCallback((nodeId: string) => {
    if (wiring && wiring.fromId !== nodeId) setWireTarget(nodeId);
  }, [wiring]);

  const onInputPortLeave = useCallback(() => {
    setWireTarget(null);
  }, []);

  /* ── Double-click to add node ──────────────── */
  const onCanvasDoubleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-dblclick]")) return;
    const pos = clientToCanvas(e.clientX, e.clientY);
    setPalettePos({ x: e.clientX, y: e.clientY });
    setShowPalette(true);
  }, [clientToCanvas]);

  const addNodeFromPalette = useCallback((palette: typeof PALETTE[number]) => {
    const pos = clientToCanvas(palettePos.x, palettePos.y);
    const newNode: FlowNode = {
      id: nextId(),
      x: snap(pos.x - 100),
      y: snap(pos.y - 40),
      label: palette.label,
      sub: palette.sub,
      color: palette.color,
      icon: palette.icon,
      w: 200,
      h: 80,
      inputs: ["in"],
      outputs: ["out"],
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    setSelectedNode(newNode.id);
    pushHistory(newNodes, edges);
    setShowPalette(false);
  }, [nodes, edges, palettePos, clientToCanvas, pushHistory]);

  /* ── Delete ────────────────────────────────── */
  const deleteSelected = useCallback(() => {
    if (selectedEdge) {
      const newEdges = edges.filter((e) => e.id !== selectedEdge);
      setEdges(newEdges);
      setSelectedEdge(null);
      pushHistory(nodes, newEdges);
    } else if (selectedNode) {
      const newNodes = nodes.filter((n) => n.id !== selectedNode);
      const newEdges = edges.filter((e) => e.from !== selectedNode && e.to !== selectedNode);
      setNodes(newNodes);
      setEdges(newEdges);
      setSelectedNode(null);
      pushHistory(newNodes, newEdges);
    }
  }, [selectedNode, selectedEdge, nodes, edges, pushHistory]);

  /* ── Duplicate ─────────────────────────────── */
  const duplicateSelected = useCallback(() => {
    if (!selectedNode) return;
    const node = nodeMap.get(selectedNode);
    if (!node) return;
    const newNode: FlowNode = { ...node, id: nextId(), x: node.x + 40, y: node.y + 40 };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    setSelectedNode(newNode.id);
    pushHistory(newNodes, edges);
  }, [selectedNode, nodes, edges, nodeMap, pushHistory]);

  /* ── Fit to view ───────────────────────────── */
  const fitToView = useCallback(() => {
    if (!containerRef.current || nodes.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xs = nodes.flatMap((n) => [n.x, n.x + n.w]);
    const ys = nodes.flatMap((n) => [n.y, n.y + n.h]);
    const minX = Math.min(...xs) - 60;
    const maxX = Math.max(...xs) + 60;
    const minY = Math.min(...ys) - 60;
    const maxY = Math.max(...ys) + 60;
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const newZoom = Math.min(2, Math.max(0.3, Math.min(rect.width / rangeX, rect.height / rangeY)));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    setZoom(newZoom);
    setPan({ x: rect.width / 2 - cx * newZoom, y: rect.height / 2 - cy * newZoom });
  }, [nodes]);

  /* ── Auto-fit on mount ──────────────────────── */
  const hasFitted = useRef(false);
  useEffect(() => {
    if (hasFitted.current) return;
    hasFitted.current = true;
    requestAnimationFrame(() => fitToView());
  }, [fitToView]);

  /* ── Zoom ──────────────────────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      setZoom((z) => {
        const nz = Math.min(2, Math.max(0.3, z * factor));
        setPan((p) => ({
          x: mx - (mx - p.x) * (nz / z),
          y: my - (my - p.y) * (nz / z),
        }));
        return nz;
      });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  /* ── Keyboard shortcuts ────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
      }
      if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        duplicateSelected();
      }
      if (e.key === "z" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.key === "z" && (e.metaKey || e.ctrlKey) && e.shiftKey) || (e.key === "y" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        redo();
      }
      if (e.key === "Escape") {
        setSelectedNode(null);
        setSelectedEdge(null);
        setShowPalette(false);
        setWiring(null);
      }
      if (e.key === "1") fitToView();
      if (e.key === "?") setShowShortcuts((s) => !s);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deleteSelected, duplicateSelected, undo, redo, fitToView]);

  /* ── Edge selection ────────────────────────── */
  const onEdgeClick = useCallback((e: React.MouseEvent, edgeId: string) => {
    e.stopPropagation();
    setSelectedEdge(edgeId);
    setSelectedNode(null);
    setShowPalette(false);
  }, []);

  /* ── Minimap ───────────────────────────────── */
  const mmW = 200, mmH = 120;
  const allX = nodes.flatMap((n) => [n.x, n.x + n.w]);
  const allY = nodes.flatMap((n) => [n.y, n.y + n.h]);
  const minX = Math.min(...allX) - 60;
  const maxX = Math.max(...allX) + 60;
  const minY = Math.min(...allY) - 60;
  const maxY = Math.max(...allY) + 60;
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  /* ── Wiring preview line ───────────────────── */
  const wirePreview = useMemo(() => {
    if (!wiring) return null;
    const fromNode = nodeMap.get(wiring.fromId);
    if (!fromNode) return null;
    const p0 = getPortPos(fromNode, "out");
    const mouse = clientToCanvas(wiring.mouseX, wiring.mouseY);
    return edgePath(p0.x, p0.y, mouse.x, mouse.y);
  }, [wiring, nodeMap, clientToCanvas]);

  /* ── Selected node info ────────────────────── */
  const selNodeData = selectedNode ? nodeMap.get(selectedNode) : null;
  const selEdgeData = selectedEdge ? edges.find((e) => e.id === selectedEdge) : null;
  const incomingCount = selectedNode ? edges.filter((e) => e.to === selectedNode).length : 0;
  const outgoingCount = selectedNode ? edges.filter((e) => e.from === selectedNode).length : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-2xl glass select-none focus:outline-none"
      style={{ cursor: wiring ? "crosshair" : isPanning ? "grabbing" : dragging ? "grabbing" : "grab" }}
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={(e) => { onMouseUp(e); setWiring(null); }}
      onDoubleClick={onCanvasDoubleClick}
      tabIndex={0}
    >
      {/* Dot grid background */}
      <div data-canvas-bg className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, var(--fg) 0.8px, transparent 0.8px)`,
        backgroundSize: `${GRID * zoom}px ${GRID * zoom}px`,
        backgroundPosition: `${pan.x % (GRID * zoom)}px ${pan.y % (GRID * zoom)}px`,
        opacity: 0.08,
      }} />

      {/* ── SVG: Edges ───────────────────────────── */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible", pointerEvents: "none" }}>
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          <defs>
            {edges.map((e) => {
              const from = nodeMap.get(e.from);
              const to = nodeMap.get(e.to);
              if (!from || !to) return null;
              return (
                <linearGradient key={e.id} id={`fg-${e.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={from.color} />
                  <stop offset="100%" stopColor={to.color} />
                </linearGradient>
              );
            })}
          </defs>

          {/* Edges */}
          {edges.map((e) => {
            const from = nodeMap.get(e.from);
            const to = nodeMap.get(e.to);
            if (!from || !to) return null;
            const p0 = getPortPos(from, "out");
            const p1 = getPortPos(to, "in");
            const path = edgePath(p0.x, p0.y, p1.x, p1.y);
            const isSelEdge = selectedEdge === e.id;
            const isHovEdge = hoveredEdge === e.id;
            const isConn = selectedNode ? (e.from === selectedNode || e.to === selectedNode) : false;
            const dimmed = (selectedNode || selectedEdge) && !isConn && !isSelEdge;

            return (
              <g key={e.id}>
                {/* Glow */}
                <path
                  d={path}
                  stroke={`url(#fg-${e.id})`}
                  strokeWidth={isSelEdge ? 18 : isConn ? 14 : 8}
                  strokeOpacity={dimmed ? 0 : isSelEdge ? 0.2 : isConn ? 0.15 : 0.07}
                  fill="none"
                  strokeLinecap="round"
                  style={{ filter: "blur(8px)", transition: "all 0.25s" }}
                />
                {/* Main line */}
                <path
                  d={path}
                  stroke={`url(#fg-${e.id})`}
                  strokeWidth={isSelEdge ? 4 : isHovEdge ? 3.5 : isConn ? 3 : 2.5}
                  strokeOpacity={dimmed ? 0.06 : isSelEdge ? 0.85 : isHovEdge ? 0.65 : isConn ? 0.7 : 0.4}
                  fill="none"
                  strokeLinecap="round"
                  style={{ transition: "all 0.25s" }}
                />
                {/* Hit area for clicking */}
                <path
                  d={path}
                  stroke="transparent"
                  strokeWidth={16}
                  fill="none"
                  strokeLinecap="round"
                  style={{ pointerEvents: "stroke", cursor: "pointer" }}
                  onClick={(ev) => onEdgeClick(ev, e.id)}
                  onMouseEnter={() => setHoveredEdge(e.id)}
                  onMouseLeave={() => setHoveredEdge(null)}
                />
                {/* Edge label on hover/select */}
                {(isHovEdge || isSelEdge) && (
                  <>
                    <rect
                      x={(p0.x + p1.x) / 2 - 60}
                      y={(p0.y + p1.y) / 2 - 22}
                      width={120}
                      height={20}
                      rx={6}
                      fill="var(--glass-bg-strong)"
                      fillOpacity={0.9}
                      stroke="var(--glass-border)"
                      strokeWidth={0.5}
                    />
                    <text
                      x={(p0.x + p1.x) / 2}
                      y={(p0.y + p1.y) / 2 - 9}
                      textAnchor="middle"
                      fill="var(--fg)"
                      fillOpacity={0.55}
                      fontSize={11}
                      fontFamily="monospace"
                    >
                      {from.label} → {to.label}
                    </text>
                  </>
                )}
                {/* Particles */}
                {e.animated && (
                  <>
                    <circle r={isConn || isSelEdge ? 5 : 3.5} fill={from.color} opacity={dimmed ? 0 : isSelEdge ? 0.9 : isConn ? 0.85 : 0.55} style={{ transition: "opacity 0.25s" }}>
                      <animateMotion dur="3s" repeatCount="indefinite" path={path} />
                    </circle>
                    <circle r={isConn || isSelEdge ? 12 : 8} fill={from.color} opacity={dimmed ? 0 : 0.12} style={{ filter: "blur(4px)", transition: "opacity 0.25s" }}>
                      <animateMotion dur="3s" repeatCount="indefinite" path={path} />
                    </circle>
                    {/* Second particle offset */}
                    <circle r={isConn || isSelEdge ? 4 : 2.5} fill={to.color} opacity={dimmed ? 0 : isSelEdge ? 0.7 : isConn ? 0.6 : 0.35} style={{ transition: "opacity 0.25s" }}>
                      <animateMotion dur="3s" begin="-1.5s" repeatCount="indefinite" path={path} />
                    </circle>
                  </>
                )}
                {/* Selected edge indicator */}
                {isSelEdge && (
                  <>
                    <circle r={6} fill="var(--fg)" fillOpacity={0.5}>
                      <animateMotion dur="2s" repeatCount="indefinite" path={path} />
                    </circle>
                    <circle r={14} fill="var(--fg)" fillOpacity={0.06} style={{ filter: "blur(4px)" }}>
                      <animateMotion dur="2s" repeatCount="indefinite" path={path} />
                    </circle>
                  </>
                )}
              </g>
            );
          })}

          {/* Wire preview */}
          {wirePreview && (
            <>
              <path d={wirePreview} stroke="var(--fg)" strokeWidth={2.5} strokeOpacity={0.45} fill="none" strokeLinecap="round" strokeDasharray="8 5">
                <animate attributeName="stroke-dashoffset" from="0" to="-26" dur="0.8s" repeatCount="indefinite" />
              </path>
              <path d={wirePreview} stroke="var(--fg)" strokeWidth={12} strokeOpacity={0.06} fill="none" strokeLinecap="round" style={{ filter: "blur(6px)" }} />
            </>
          )}
        </g>
      </svg>

      {/* ── Nodes (HTML) ─────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }}
      >
        {nodes.map((n) => {
          const isSel = selectedNode === n.id;
          const isConn = connectedIds.has(n.id);
          const dimmed = (selectedNode || selectedEdge) && !isConn && !isSel;
          const isWireTarget = wireTarget === n.id;

          return (
            <div
              key={n.id}
              data-no-dblclick
              className="absolute group"
              style={{
                left: n.x,
                top: n.y,
                width: n.w,
                height: n.h,
                transition: dragging === n.id ? "none" : "box-shadow 0.25s, opacity 0.25s, transform 0.15s",
                opacity: dimmed ? 0.25 : 1,
                zIndex: isSel ? 10 : 1,
                transform: isSel ? "scale(1.02)" : "scale(1)",
              }}
              onMouseDown={(e) => onNodeMouseDown(e, n.id)}
            >
              {/* Node card */}
              <div
                className="w-full h-full rounded-2xl flex items-center gap-3.5 px-5 transition-all duration-200 relative overflow-hidden"
                style={{
                  background: isSel
                    ? `color-mix(in srgb, ${n.color} 18%, var(--glass-bg-strong))`
                    : isWireTarget
                      ? `color-mix(in srgb, ${n.color} 12%, var(--glass-bg-strong))`
                      : `color-mix(in srgb, ${n.color} 6%, var(--glass-bg-strong))`,
                  border: `1.5px solid ${isSel
                    ? `color-mix(in srgb, ${n.color} 50%, transparent)`
                    : isWireTarget
                      ? `color-mix(in srgb, ${n.color} 60%, transparent)`
                      : isConn
                        ? `color-mix(in srgb, ${n.color} 30%, transparent)`
                        : "var(--glass-border-strong)"
                  }`,
                  backdropFilter: "blur(16px)",
                  boxShadow: isSel
                    ? `0 8px 32px rgba(0,0,0,0.35), 0 0 24px color-mix(in srgb, ${n.color} 15%, transparent), inset 0 1px 0 rgba(255,255,255,0.06)`
                    : isWireTarget
                      ? `0 0 20px color-mix(in srgb, ${n.color} 20%, transparent), inset 0 1px 0 rgba(255,255,255,0.06)`
                      : `0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)`,
                  cursor: dragging === n.id ? "grabbing" : "grab",
                }}
              >
                {/* Colored left accent */}
                <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full" style={{ background: n.color, opacity: isSel ? 0.8 : 0.4, boxShadow: isSel ? `0 0 10px ${n.color}` : "none", transition: "all 0.25s" }} />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{
                    background: `color-mix(in srgb, ${n.color} ${isSel ? 22 : 14}%, transparent)`,
                    color: n.color,
                    opacity: isSel ? 1 : 0.8,
                    boxShadow: `0 0 16px color-mix(in srgb, ${n.color} ${isSel ? 14 : 5}%, transparent)`,
                  }}
                >
                  {n.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-fg/80 truncate">{n.label}</p>
                  {n.sub && <p className="text-[11px] text-fg/35 font-mono truncate mt-0.5">{n.sub}</p>}
                </div>

                {/* Connection count badges */}
                {isSel && (
                  <div className="flex flex-col gap-1 shrink-0 mr-1">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-md glass text-fg/40">{edges.filter((e) => e.to === n.id).length} in</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-md glass text-fg/40">{edges.filter((e) => e.from === n.id).length} out</span>
                  </div>
                )}

                {/* Input port */}
                {n.inputs && (
                  <div
                    className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full border-[2.5px] transition-all duration-200 z-20"
                    style={{
                      borderColor: isWireTarget ? n.color : isSel ? n.color : isConn ? n.color : "var(--glass-border-strong)",
                      background: isWireTarget ? n.color : isSel ? n.color : isConn ? `color-mix(in srgb, ${n.color} 40%, var(--body-bg))` : "var(--body-bg)",
                      opacity: isWireTarget ? 1 : isSel ? 0.9 : isConn ? 0.7 : 0.5,
                      boxShadow: isWireTarget ? `0 0 16px ${n.color}` : isSel ? `0 0 12px color-mix(in srgb, ${n.color} 30%, transparent)` : "none",
                      cursor: "default",
                      transform: `translateY(-50%) ${isWireTarget ? "scale(1.3)" : "scale(1)"}`,
                    }}
                    onMouseEnter={() => onInputPortEnter(n.id)}
                    onMouseLeave={onInputPortLeave}
                  />
                )}
                {/* Output port */}
                {n.outputs && (
                  <div
                    className="absolute -right-[9px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full border-[2.5px] transition-all duration-200 z-20"
                    style={{
                      borderColor: isSel ? n.color : isConn ? n.color : "var(--glass-border-strong)",
                      background: isSel ? n.color : isConn ? `color-mix(in srgb, ${n.color} 40%, var(--body-bg))` : "var(--body-bg)",
                      opacity: isSel ? 0.9 : isConn ? 0.7 : 0.5,
                      boxShadow: isSel ? `0 0 12px color-mix(in srgb, ${n.color} 30%, transparent)` : "none",
                      cursor: "crosshair",
                    }}
                    onMouseDown={(e) => onOutputPortDown(e, n.id)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Wire drawing hint ────────────────────── */}
      {wiring && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 glass-strong rounded-lg px-4 py-2 border border-[var(--glass-border-strong)] z-30">
          <p className="text-[11px] font-mono text-fg/50">
            drag to an input port to connect · <span className="text-fg/30">esc to cancel</span>
          </p>
        </div>
      )}

      {/* ── Palette (double-click) ───────────────── */}
      {showPalette && (
        <div
          className="absolute z-40 glass-strong rounded-2xl border border-[var(--glass-border-strong)] p-2.5 flex flex-col gap-0.5 shadow-xl backdrop-blur-xl"
          style={{
            left: palettePos.x - (containerRef.current?.getBoundingClientRect().left || 0),
            top: palettePos.y - (containerRef.current?.getBoundingClientRect().top || 0),
          }}
          data-no-dblclick
        >
          <p className="text-[9px] uppercase tracking-widest text-fg/25 font-semibold px-3 pt-1.5 pb-1">add node</p>
          {PALETTE.map((p) => (
            <button
              key={p.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--glass-bg)] transition-all cursor-pointer text-left group"
              onClick={() => addNodeFromPalette(p)}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base group-hover:scale-110 transition-transform" style={{ background: `color-mix(in srgb, ${p.color} 12%, transparent)`, color: p.color }}>
                {p.icon}
              </div>
              <div>
                <p className="text-[12px] font-medium text-fg/70">{p.label}</p>
                <p className="text-[10px] font-mono text-fg/30">{p.sub}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Selection info panel ─────────────────── */}
      {(selNodeData || selEdgeData) && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-strong rounded-2xl border border-[var(--glass-border-strong)] px-6 py-3.5 flex items-center gap-5 z-30 shadow-xl" data-no-dblclick>
          {selNodeData && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `color-mix(in srgb, ${selNodeData.color} 15%, transparent)`, color: selNodeData.color }}>
                  {selNodeData.icon}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-fg/70">{selNodeData.label}</p>
                  {selNodeData.sub && <p className="text-[10px] font-mono text-fg/30">{selNodeData.sub}</p>}
                </div>
              </div>
              <div className="w-px h-10 bg-[var(--glass-border)]" />
              <div className="flex gap-4 text-[11px] font-mono text-fg/40">
                <span>{incomingCount} in</span>
                <span>{outgoingCount} out</span>
                <span className="text-fg/25">({Math.round(selNodeData.x)}, {Math.round(selNodeData.y)})</span>
              </div>
              <div className="w-px h-10 bg-[var(--glass-border)]" />
              <div className="flex items-center gap-2">
                <button onClick={duplicateSelected} className="px-3 py-1.5 rounded-lg glass text-[11px] font-mono text-fg/40 hover:text-fg/70 transition-colors cursor-pointer" title="Ctrl+D">dup</button>
                <button onClick={deleteSelected} className="px-3 py-1.5 rounded-lg glass text-[11px] font-mono text-red-400/60 hover:text-red-400 transition-colors cursor-pointer" title="Delete">del</button>
              </div>
            </>
          )}
          {selEdgeData && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: nodeMap.get(selEdgeData.from)?.color, opacity: 0.7 }} />
                  <span className="text-[13px] font-mono text-fg/50">{nodeMap.get(selEdgeData.from)?.label}</span>
                </div>
                <span className="text-fg/25 text-xs">→</span>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: nodeMap.get(selEdgeData.to)?.color, opacity: 0.7 }} />
                  <span className="text-[13px] font-mono text-fg/50">{nodeMap.get(selEdgeData.to)?.label}</span>
                </div>
              </div>
              <div className="w-px h-10 bg-[var(--glass-border)]" />
              <button onClick={deleteSelected} className="px-3 py-1.5 rounded-lg glass text-[11px] font-mono text-red-400/60 hover:text-red-400 transition-colors cursor-pointer" title="Delete">remove</button>
            </>
          )}
        </div>
      )}

      {/* ── Minimap ──────────────────────────────── */}
      <div className="absolute bottom-4 right-4 glass-strong rounded-xl overflow-hidden border border-[var(--glass-border-strong)] shadow-lg" style={{ width: mmW, height: mmH }} data-no-dblclick>
        <svg viewBox={`${minX} ${minY} ${rangeX} ${rangeY}`} className="w-full h-full" fill="none">
          {edges.map((e) => {
            const from = nodeMap.get(e.from);
            const to = nodeMap.get(e.to);
            if (!from || !to) return null;
            const p0 = getPortPos(from, "out");
            const p1 = getPortPos(to, "in");
            return <line key={e.id} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="var(--fg)" strokeWidth={2} strokeOpacity={0.12} />;
          })}
          {nodes.map((n) => (
            <rect key={n.id} x={n.x} y={n.y} width={n.w} height={n.h} rx={4} fill={n.color} fillOpacity={selectedNode === n.id ? 0.6 : 0.3} />
          ))}
          <rect
            x={-pan.x / zoom}
            y={-pan.y / zoom}
            width={(containerRef.current?.clientWidth || 800) / zoom}
            height={(containerRef.current?.clientHeight || 500) / zoom}
            rx={4}
            fill="none"
            stroke="var(--fg)"
            strokeWidth={4}
            strokeOpacity={0.12}
          />
        </svg>
      </div>

      {/* ── Toolbar ──────────────────────────────── */}
      <div className="absolute top-4 right-4 flex items-center gap-1 glass-strong rounded-xl border border-[var(--glass-border-strong)] p-1.5" data-no-dblclick>
        <button onClick={() => setZoom((z) => Math.min(2, z * 1.15))} className="w-8 h-8 rounded-lg hover:bg-[var(--glass-bg)] flex items-center justify-center text-fg/40 hover:text-fg/70 transition-all cursor-pointer text-base font-mono" title="Zoom in">+</button>
        <div className="px-2.5 h-8 rounded-lg flex items-center justify-center text-[11px] font-mono text-fg/30 min-w-[48px]">{Math.round(zoom * 100)}%</div>
        <button onClick={() => setZoom((z) => Math.max(0.3, z * 0.87))} className="w-8 h-8 rounded-lg hover:bg-[var(--glass-bg)] flex items-center justify-center text-fg/40 hover:text-fg/70 transition-all cursor-pointer text-base font-mono" title="Zoom out">−</button>
        <div className="w-px h-5 bg-[var(--glass-border)] mx-1" />
        <button onClick={fitToView} className="h-8 px-3 rounded-lg hover:bg-[var(--glass-bg)] flex items-center justify-center text-[11px] font-mono text-fg/30 hover:text-fg/60 transition-all cursor-pointer" title="Fit to view (1)">fit</button>
        <button onClick={() => { setPan({ x: 0, y: 0 }); setZoom(1); }} className="h-8 px-3 rounded-lg hover:bg-[var(--glass-bg)] flex items-center justify-center text-[11px] font-mono text-fg/30 hover:text-fg/60 transition-all cursor-pointer" title="Reset view">reset</button>
        <div className="w-px h-5 bg-[var(--glass-border)] mx-1" />
        <button onClick={undo} className="h-8 px-2.5 rounded-lg hover:bg-[var(--glass-bg)] flex items-center justify-center text-fg/30 hover:text-fg/60 transition-all cursor-pointer" title="Undo (Ctrl+Z)" disabled={histIdx <= 0}>
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h7a3 3 0 010 6H8" /><path d="M6 3L3 6l3 3" /></svg>
        </button>
        <button onClick={redo} className="h-8 px-2.5 rounded-lg hover:bg-[var(--glass-bg)] flex items-center justify-center text-fg/30 hover:text-fg/60 transition-all cursor-pointer" title="Redo (Ctrl+Shift+Z)" disabled={histIdx >= history.length - 1}>
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 6H6a3 3 0 000 6h2" /><path d="M10 3l3 3-3 3" /></svg>
        </button>
        <div className="w-px h-5 bg-[var(--glass-border)] mx-1" />
        <button onClick={() => setShowShortcuts((s) => !s)} className="h-8 px-2.5 rounded-lg hover:bg-[var(--glass-bg)] flex items-center justify-center text-[12px] font-mono text-fg/30 hover:text-fg/60 transition-all cursor-pointer" title="Keyboard shortcuts (?)">?</button>
      </div>

      {/* ── Legend ────────────────────────────────── */}
      <div className="absolute top-4 left-4 glass-strong rounded-xl px-4 py-3 flex flex-col gap-2 border border-[var(--glass-border-strong)]" data-no-dblclick>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-fg/35 mb-0.5">layers</p>
        {[
          { label: "input", color: "var(--pastel-pink)" },
          { label: "process", color: "var(--pastel-green)" },
          { label: "state", color: "var(--pastel-blue)" },
          { label: "output", color: "var(--pastel-yellow)" },
          { label: "utility", color: "var(--pastel-orange)" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full" style={{ background: l.color, opacity: 0.75, boxShadow: `0 0 8px ${l.color}` }} />
            <span className="text-[11px] text-fg/50 font-mono">{l.label}</span>
          </div>
        ))}
      </div>

      {/* ── Shortcuts panel ──────────────────────── */}
      {showShortcuts && (
        <div className="absolute top-16 right-4 glass-strong rounded-2xl border border-[var(--glass-border-strong)] px-5 py-4 z-40 w-64 shadow-xl" data-no-dblclick>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-fg/35 mb-3">shortcuts</p>
          {[
            ["Double-click", "Add node"],
            ["Drag output", "Connect"],
            ["Click edge", "Select edge"],
            ["Del / ⌫", "Remove"],
            ["⌘ D", "Duplicate"],
            ["⌘ Z", "Undo"],
            ["⌘ ⇧ Z", "Redo"],
            ["1", "Fit to view"],
            ["Esc", "Deselect"],
            ["Scroll", "Zoom"],
            ["?", "Toggle panel"],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between py-1.5">
              <span className="text-[11px] font-mono text-fg/50 bg-[var(--glass-bg)] px-2 py-0.5 rounded-md">{key}</span>
              <span className="text-[11px] text-fg/35">{desc}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Bottom bar ────────────────────────────── */}
      <div className="absolute bottom-4 left-4 glass-strong rounded-xl border border-[var(--glass-border-strong)] px-4 py-2 flex items-center gap-3" data-no-dblclick>
        <span className="text-[10px] font-mono text-fg/25">{nodes.length} nodes · {edges.length} edges</span>
        <div className="w-px h-4 bg-[var(--glass-border)]" />
        <span className="text-[10px] text-fg/25 font-mono">dbl-click to add · drag ports to wire · <b className="text-fg/40">?</b> shortcuts</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── PAGE ────────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

export default function FlowPage() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "var(--orb-1)", filter: "blur(120px)", top: "-10%", left: "5%" }} />
        <div className="absolute rounded-full" style={{ width: 400, height: 400, background: "var(--orb-2)", filter: "blur(120px)", bottom: "-5%", right: "5%" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-10 pb-10 sm:pt-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tighter text-fg">flow</h1>
              <p className="mt-2 text-sm text-fg/30 max-w-xl">
                interactive node-based canvas — drag to reposition, connect ports, double-click to add, full undo/redo. zero dependencies.
              </p>
            </div>
            <code className="hidden sm:inline-block text-[11px] font-mono px-4 py-2 rounded-xl glass text-fg/30 select-all border border-[var(--glass-border)]">
              npx sandbox-ui add flow
            </code>
          </div>

          <section style={{ height: "calc(100vh - 180px)", minHeight: "540px" }}>
            <FlowCanvas />
          </section>

          <footer className="text-sm text-fg/15 pt-12 pb-8">
            &copy; {new Date().getFullYear()} Sandbox
          </footer>
        </div>
      </div>
    </>
  );
}
