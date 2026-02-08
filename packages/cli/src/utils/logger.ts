import chalk from "chalk";

export const logger = {
  info(msg: string) {
    console.log(chalk.cyan("●") + " " + msg);
  },

  success(msg: string) {
    console.log(chalk.green("✓") + " " + msg);
  },

  warn(msg: string) {
    console.log(chalk.yellow("▲") + " " + msg);
  },

  error(msg: string) {
    console.log(chalk.red("✗") + " " + msg);
  },

  break() {
    console.log();
  },

  title(msg: string) {
    console.log();
    console.log(chalk.bold(msg));
    console.log(chalk.dim("─".repeat(Math.min(msg.length + 4, 50))));
  },

  list(items: string[]) {
    for (const item of items) {
      console.log(chalk.dim("  -") + " " + item);
    }
  },

  command(cmd: string) {
    console.log();
    console.log("  " + chalk.bgBlack.white(` ${cmd} `));
    console.log();
  },

  dim(msg: string) {
    console.log(chalk.dim("  " + msg));
  },

  file(path: string) {
    return chalk.underline(path);
  },

  highlight(text: string) {
    return chalk.cyan(text);
  },

  bold(text: string) {
    return chalk.bold(text);
  },
};
