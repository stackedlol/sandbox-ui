import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

/* ─── Types ────────────────────────────────────────────────────── */

export interface RegistryComponent {
  name: string;
  description: string;
  files: string[];
  localDependencies: string[];
  registryDependencies: string[];
  packages: string[];
  cssClasses?: string[];
}

export interface RegistryUtil {
  name: string;
  description: string;
  files: string[];
  packages: string[];
}

export interface Registry {
  components: Record<string, RegistryComponent>;
  utils: Record<string, RegistryUtil>;
}

/* ─── Load the bundled registry ───────────────────────────────── */

let _registry: Registry | null = null;

export function getRegistryPath(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // In dist/ the file is at ../../registry.json relative to dist/utils/
  return path.resolve(__dirname, "..", "..", "registry.json");
}

export function getRegistryDir(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, "..", "..", "registry");
}

export async function loadRegistry(): Promise<Registry> {
  if (_registry) return _registry;
  const raw = await fs.readFile(getRegistryPath(), "utf-8");
  _registry = JSON.parse(raw) as Registry;
  return _registry;
}

/* ─── Lookup ──────────────────────────────────────────────────── */

export function getComponent(
  registry: Registry,
  name: string,
): RegistryComponent | undefined {
  return registry.components[name];
}

export function getUtil(
  registry: Registry,
  name: string,
): RegistryUtil | undefined {
  return registry.utils[name];
}

export function listComponents(registry: Registry): string[] {
  return Object.keys(registry.components);
}

/* ─── Dependency resolution (topological sort) ───────────────── */

export interface ResolvedItem {
  type: "component" | "util";
  key: string;
  entry: RegistryComponent | RegistryUtil;
}

/**
 * Resolve all transitive dependencies for a list of component names.
 * Returns a topologically sorted array (dependencies first).
 */
export function resolveDependencies(
  registry: Registry,
  componentNames: string[],
): ResolvedItem[] {
  const visited = new Set<string>();
  const result: ResolvedItem[] = [];

  function visitComponent(name: string) {
    const key = `component:${name}`;
    if (visited.has(key)) return;
    visited.add(key);

    const comp = registry.components[name];
    if (!comp) return;

    // Visit registry dependencies first (other components)
    for (const dep of comp.registryDependencies) {
      visitComponent(dep);
    }

    // Visit local dependencies (utils like cn)
    for (const dep of comp.localDependencies) {
      visitUtil(dep);
    }

    result.push({ type: "component", key: name, entry: comp });
  }

  function visitUtil(name: string) {
    const key = `util:${name}`;
    if (visited.has(key)) return;
    visited.add(key);

    const util = registry.utils[name];
    if (!util) return;

    result.push({ type: "util", key: name, entry: util });
  }

  for (const name of componentNames) {
    visitComponent(name);
  }

  return result;
}

/**
 * Collect all npm packages required by a set of resolved items.
 */
export function collectPackages(items: ResolvedItem[]): string[] {
  const pkgs = new Set<string>();
  for (const item of items) {
    if ("packages" in item.entry) {
      for (const pkg of item.entry.packages) {
        pkgs.add(pkg);
      }
    }
  }
  return [...pkgs];
}
