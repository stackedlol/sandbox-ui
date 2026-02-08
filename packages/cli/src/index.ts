#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";
import { loadRegistry, listComponents } from "./utils/registry.js";
import { logger } from "./utils/logger.js";

const program = new Command();

program
  .name("sandbox-ui")
  .description("Add glassmorphism components to your project.")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize your project with sandbox-ui base styles and config.")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(async (opts: { yes?: boolean }) => {
    try {
      await initCommand({ yes: opts.yes });
    } catch (err) {
      logger.error(String(err));
      process.exit(1);
    }
  });

program
  .command("add")
  .description("Add components to your project.")
  .argument("[components...]", "Component names to add")
  .option("-y, --yes", "Skip confirmation prompts")
  .action(async (components: string[], opts: { yes?: boolean }) => {
    try {
      if (!components || components.length === 0) {
        // Show available components
        const registry = await loadRegistry();
        const names = listComponents(registry);
        logger.title("Available components");
        for (const name of names) {
          const comp = registry.components[name];
          logger.info(`${logger.bold(name)} — ${comp.description}`);
        }
        logger.break();
        logger.dim("Usage: npx sandbox-ui add <component...>");
        logger.dim("Example: npx sandbox-ui add button card pricing");
        return;
      }
      await addCommand(components, { yes: opts.yes });
    } catch (err) {
      logger.error(String(err));
      process.exit(1);
    }
  });

program.parse();
