#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import fs from "fs-extra";
import chalk from "chalk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.resolve(__dirname, "..", "template");

/* ─── Helpers ──────────────────────────────────────────────────── */

function log(msg: string) {
  console.log(msg);
}

function success(msg: string) {
  console.log(chalk.green("✓") + " " + msg);
}

function info(msg: string) {
  console.log(chalk.cyan("●") + " " + msg);
}

function error(msg: string) {
  console.log(chalk.red("✗") + " " + msg);
}

function banner() {
  console.log();
  console.log(chalk.bold("  create-sandbox-ui"));
  console.log(chalk.dim("  Glassmorphism component starter"));
  console.log();
}

/* ─── Main ─────────────────────────────────────────────────────── */

async function main() {
  banner();

  // Parse project name from args
  const args = process.argv.slice(2);
  let projectName = args[0];

  if (!projectName) {
    error("Please specify a project name:");
    log("");
    log("  " + chalk.cyan("npx create-sandbox-ui") + " " + chalk.green("my-app"));
    log("");
    process.exit(1);
  }

  // Strip leading ./ or / for display
  const projectPath = path.resolve(process.cwd(), projectName);
  const displayName = path.basename(projectPath);

  // Check if directory already exists
  if (fs.existsSync(projectPath)) {
    const contents = fs.readdirSync(projectPath);
    if (contents.length > 0) {
      error(`Directory ${chalk.bold(displayName)} already exists and is not empty.`);
      process.exit(1);
    }
  }

  // 1. Copy template
  info(`Creating ${chalk.bold(displayName)} ...`);
  await fs.copy(templateDir, projectPath);
  success("Copied project files.");

  // 2. Rewrite package.json name
  const pkgPath = path.join(projectPath, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJSON(pkgPath);
    pkg.name = displayName;
    await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
    success(`Set package name to ${chalk.bold(displayName)}.`);
  }

  // 3. Rename gitignore (npm strips .gitignore from published packages)
  const gitignoreSrc = path.join(projectPath, "_gitignore");
  const gitignoreDest = path.join(projectPath, ".gitignore");
  if (fs.existsSync(gitignoreSrc)) {
    await fs.rename(gitignoreSrc, gitignoreDest);
  }

  // 4. Install dependencies
  info("Installing dependencies (this may take a minute) ...");
  try {
    execSync("npm install", {
      cwd: projectPath,
      stdio: "inherit",
    });
    success("Dependencies installed.");
  } catch {
    log("");
    log(chalk.yellow("  Could not install dependencies automatically."));
    log(chalk.yellow("  Run " + chalk.bold("npm install") + " manually inside the project."));
    log("");
  }

  // 5. Initialize git
  try {
    execSync("git init", { cwd: projectPath, stdio: "ignore" });
    execSync("git add -A", { cwd: projectPath, stdio: "ignore" });
    execSync('git commit -m "Initial commit from create-sandbox-ui"', {
      cwd: projectPath,
      stdio: "ignore",
    });
    success("Initialized git repository.");
  } catch {
    // git not available or failed — not critical
  }

  // 6. Done!
  log("");
  log(chalk.bold("  Done! Your project is ready."));
  log("");
  log("  Get started:");
  log("");
  log("    " + chalk.cyan("cd") + " " + displayName);
  log("    " + chalk.cyan("npm run dev"));
  log("");
  log("  Then open " + chalk.underline("http://localhost:3000"));
  log("");
  log(chalk.dim("  To add components to another project:"));
  log(chalk.dim("    npx sandbox-ui init"));
  log(chalk.dim("    npx sandbox-ui add button card pricing"));
  log("");
}

main().catch((err) => {
  error(String(err));
  process.exit(1);
});
