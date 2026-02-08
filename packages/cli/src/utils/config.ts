import path from "node:path";
import fs from "fs-extra";

export interface Config {
  style: string;
  tailwind: {
    css: string;
  };
  aliases: {
    components: string;
    utils: string;
  };
}

const CONFIG_FILE = "components.json";

/**
 * Resolve the project root by walking up from cwd looking for package.json.
 */
export function getProjectRoot(): string {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

/**
 * Read the components.json config from the project root.
 * Returns null if not found.
 */
export async function readConfig(): Promise<Config | null> {
  const root = getProjectRoot();
  const configPath = path.join(root, CONFIG_FILE);
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const raw = await fs.readFile(configPath, "utf-8");
  return JSON.parse(raw) as Config;
}

/**
 * Write the components.json config to the project root.
 */
export async function writeConfig(config: Config): Promise<string> {
  const root = getProjectRoot();
  const configPath = path.join(root, CONFIG_FILE);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
  return configPath;
}

/**
 * Resolve an alias like "@/components/ui" to an absolute filesystem path.
 * Handles the common "@/" prefix by mapping it to the project root.
 */
export function resolveAlias(alias: string): string {
  const root = getProjectRoot();
  if (alias.startsWith("@/")) {
    return path.join(root, alias.slice(2));
  }
  return path.resolve(root, alias);
}
