import path from "node:path";
import fs from "fs-extra";
import prompts from "prompts";
import { logger } from "../utils/logger.js";
import { readConfig, resolveAlias, getProjectRoot } from "../utils/config.js";
import {
  loadRegistry,
  resolveDependencies,
  collectPackages,
  listComponents,
  getRegistryDir,
  type ResolvedItem,
  type RegistryComponent,
} from "../utils/registry.js";

/**
 * Rewrite import paths in a component file to match the user's configured aliases.
 *
 * Handles:
 *   @/lib/cn     → <utilsAlias>/cn
 *   @/components/ui/...  → <componentsAlias>/...
 *   ./button, ./card etc → <componentsAlias>/...
 */
function rewriteImports(
  source: string,
  componentsAlias: string,
  utilsAlias: string,
): string {
  let result = source;

  // Rewrite @/lib/cn → utilsAlias/cn
  result = result.replace(
    /@\/lib\/cn/g,
    `${utilsAlias}/cn`,
  );

  // Rewrite @/lib/ → utilsAlias/
  result = result.replace(
    /@\/lib\//g,
    `${utilsAlias}/`,
  );

  // Rewrite @/components/ui/ → componentsAlias/
  result = result.replace(
    /@\/components\/ui\//g,
    `${componentsAlias}/`,
  );

  // Rewrite relative imports to sibling components: ./button → componentsAlias/button
  result = result.replace(
    /from\s+["']\.\/(\w+)["']/g,
    `from "${componentsAlias}/$1"`,
  );

  return result;
}

interface AddOptions {
  yes?: boolean;
}

export async function addCommand(componentNames: string[], options: AddOptions = {}) {
  // Read config
  const config = await readConfig();
  if (!config) {
    logger.error("No components.json found. Run " + logger.highlight("npx sandbox-ui init") + " first.");
    process.exit(1);
  }

  const registry = await loadRegistry();
  const available = listComponents(registry);

  // Validate component names
  const invalid = componentNames.filter((n) => !available.includes(n));
  if (invalid.length > 0) {
    logger.error(`Unknown component(s): ${invalid.join(", ")}`);
    logger.break();
    logger.info("Available components:");
    logger.list(available);
    process.exit(1);
  }

  // Resolve dependencies
  const resolved = resolveDependencies(registry, componentNames);
  const packages = collectPackages(resolved);

  // Show what will be installed
  logger.title("Components to install");
  for (const item of resolved) {
    const label = item.type === "util" ? `${item.key} (utility)` : item.key;
    const desc = item.entry.description;
    logger.info(`${logger.bold(label)} — ${desc}`);
  }
  logger.break();

  // Confirm
  if (!options.yes) {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: `Install ${resolved.length} file(s)?`,
      initial: true,
    });

    if (!proceed) {
      logger.info("Cancelled.");
      return;
    }
  }

  const root = getProjectRoot();
  const registryDir = getRegistryDir();
  const componentsDir = resolveAlias(config.aliases.components);
  const utilsDir = resolveAlias(config.aliases.utils);

  let filesWritten = 0;

  for (const item of resolved) {
    await installItem(item, {
      root,
      registryDir,
      componentsDir,
      utilsDir,
      componentsAlias: config.aliases.components,
      utilsAlias: config.aliases.utils,
      yes: !!options.yes,
    });
    filesWritten++;
  }

  // Summary
  logger.break();
  logger.success(`Installed ${filesWritten} file(s).`);

  if (packages.length > 0) {
    // Filter out packages that might already be in the user's package.json
    const pkgJsonPath = path.join(root, "package.json");
    let existingPkgs: string[] = [];
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = await fs.readJSON(pkgJsonPath);
      existingPkgs = [
        ...Object.keys(pkgJson.dependencies || {}),
        ...Object.keys(pkgJson.devDependencies || {}),
      ];
    }
    const missing = packages.filter((p) => !existingPkgs.includes(p));
    if (missing.length > 0) {
      logger.break();
      logger.info("Install required dependencies:");
      logger.command(`npm install ${missing.join(" ")}`);
    }
  }
}

interface InstallContext {
  root: string;
  registryDir: string;
  componentsDir: string;
  utilsDir: string;
  componentsAlias: string;
  utilsAlias: string;
  yes: boolean;
}

async function installItem(item: ResolvedItem, ctx: InstallContext) {
  for (const file of item.entry.files) {
    const srcPath = path.join(ctx.registryDir, file);

    // Determine destination based on item type
    let destPath: string;
    if (item.type === "util") {
      // lib/cn.ts → utilsDir/cn.ts
      const basename = path.basename(file);
      destPath = path.join(ctx.utilsDir, basename);
    } else {
      // components/ui/button.tsx → componentsDir/button.tsx
      const basename = path.basename(file);
      destPath = path.join(ctx.componentsDir, basename);
    }

    // Check for existing file
    if (fs.existsSync(destPath) && !ctx.yes) {
      const { overwrite } = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `${path.relative(ctx.root, destPath)} already exists. Overwrite?`,
        initial: false,
      });
      if (!overwrite) {
        logger.dim(`Skipped ${path.relative(ctx.root, destPath)}`);
        continue;
      }
    }

    // Read source, rewrite imports, write destination
    if (!fs.existsSync(srcPath)) {
      logger.warn(`Source file not found: ${file} — skipping`);
      continue;
    }

    let content = await fs.readFile(srcPath, "utf-8");

    // Only rewrite imports for component files (not utils)
    if (item.type === "component") {
      content = rewriteImports(content, ctx.componentsAlias, ctx.utilsAlias);
    }

    await fs.ensureDir(path.dirname(destPath));
    await fs.writeFile(destPath, content, "utf-8");
    logger.success(`Created ${logger.file(path.relative(ctx.root, destPath))}`);
  }
}
