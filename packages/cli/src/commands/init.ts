import path from "node:path";
import fs from "fs-extra";
import prompts from "prompts";
import { logger } from "../utils/logger.js";
import { writeConfig, readConfig, getProjectRoot } from "../utils/config.js";
import { getRegistryDir } from "../utils/registry.js";
import { BASE_CSS, hasBaseStyles } from "../utils/css.js";

interface InitOptions {
  yes?: boolean;
}

export async function initCommand(options: InitOptions = {}) {
  logger.title("sandbox-ui init");

  // Check for existing config
  const existing = await readConfig();
  if (existing && !options.yes) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: "components.json already exists. Overwrite?",
      initial: false,
    });
    if (!overwrite) {
      logger.info("Init cancelled.");
      return;
    }
  }

  // Defaults
  const defaults = {
    componentsAlias: "@/components/ui",
    utilsAlias: "@/lib",
    cssPath: "app/globals.css",
    typescript: true,
  };

  let answers = defaults;

  if (!options.yes) {
    // Interactive prompts
    const response = await prompts([
      {
        type: "text",
        name: "componentsAlias",
        message: "Where should components be installed?",
        initial: defaults.componentsAlias,
      },
      {
        type: "text",
        name: "utilsAlias",
        message: "Where should utilities (cn, etc.) be installed?",
        initial: defaults.utilsAlias,
      },
      {
        type: "text",
        name: "cssPath",
        message: "Path to your global CSS file?",
        initial: defaults.cssPath,
      },
      {
        type: "confirm",
        name: "typescript",
        message: "Are you using TypeScript?",
        initial: defaults.typescript,
      },
    ]);

    if (!response.componentsAlias) {
      logger.error("Init cancelled.");
      return;
    }

    answers = response as typeof defaults;
  }

  const root = getProjectRoot();

  // 1. Write components.json
  const configPath = await writeConfig({
    style: "glass",
    tailwind: {
      css: answers.cssPath,
    },
    aliases: {
      components: answers.componentsAlias,
      utils: answers.utilsAlias,
    },
  });
  logger.success(`Created ${logger.file(path.relative(root, configPath))}`);

  // 2. Copy cn utility
  const utilsDir = answers.utilsAlias.startsWith("@/")
    ? path.join(root, answers.utilsAlias.slice(2))
    : path.resolve(root, answers.utilsAlias);

  await fs.ensureDir(utilsDir);

  const cnSource = path.join(getRegistryDir(), "lib", "cn.ts");
  const cnDest = path.join(utilsDir, answers.typescript ? "cn.ts" : "cn.js");

  if (fs.existsSync(cnSource)) {
    await fs.copyFile(cnSource, cnDest);
    logger.success(`Created ${logger.file(path.relative(root, cnDest))}`);
  } else {
    // Fallback: write cn directly
    const cnContent = answers.typescript
      ? `import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n`
      : `import { clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs) {\n  return twMerge(clsx(inputs));\n}\n`;
    await fs.writeFile(cnDest, cnContent, "utf-8");
    logger.success(`Created ${logger.file(path.relative(root, cnDest))}`);
  }

  // 3. Inject base CSS
  const cssPath = path.resolve(root, answers.cssPath);

  if (fs.existsSync(cssPath)) {
    const existingCSS = await fs.readFile(cssPath, "utf-8");
    if (hasBaseStyles(existingCSS)) {
      logger.info("Base glass styles already present in CSS — skipped.");
    } else {
      await fs.writeFile(cssPath, existingCSS + "\n\n" + BASE_CSS + "\n", "utf-8");
      logger.success(`Injected glass styles into ${logger.file(path.relative(root, cssPath))}`);
    }
  } else {
    await fs.ensureDir(path.dirname(cssPath));
    await fs.writeFile(cssPath, BASE_CSS + "\n", "utf-8");
    logger.success(`Created ${logger.file(path.relative(root, cssPath))} with glass styles`);
  }

  // 4. Summary
  logger.break();
  logger.title("Done!");
  logger.info("Install required dependencies:");
  logger.command("npm install clsx tailwind-merge");
  logger.info("Then add your first component:");
  logger.command("npx sandbox-ui add button");
  logger.break();
}
