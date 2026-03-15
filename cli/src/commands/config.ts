import { Command } from "commander";
import chalk from "chalk";
import { loadConfig, saveConfig } from "../config.js";

export function registerConfigCommand(program: Command): void {
  const config = program
    .command("config")
    .description("View and modify CLI configuration");

  config
    .command("show")
    .description("Display current configuration")
    .action(() => {
      const cfg = loadConfig();

      console.log(chalk.bold("\n  ARA FINESTRA CLI — Configuració\n"));

      console.log(
        `  API URL:        ${chalk.cyan(cfg.apiUrl)}`
      );

      const sessionStatus = cfg.sessionCookie
        ? chalk.green("activa")
        : chalk.red("no iniciada");
      console.log(`  Sessió:         ${sessionStatus}`);

      const keyStatus = cfg.anthropicApiKey
        ? chalk.green("configurada")
        : chalk.red("no configurada");
      console.log(`  Anthropic Key:  ${keyStatus}`);

      console.log();
    });

  config
    .command("set")
    .description("Set configuration values")
    .option("--api-url <url>", "Override API URL")
    .option("--anthropic-key <key>", "Set Anthropic API key")
    .action((opts: { apiUrl?: string; anthropicKey?: string }) => {
      const cfg = loadConfig();
      let changed = false;

      if (opts.apiUrl) {
        cfg.apiUrl = opts.apiUrl;
        changed = true;
      }

      if (opts.anthropicKey) {
        cfg.anthropicApiKey = opts.anthropicKey;
        changed = true;
      }

      if (!changed) {
        console.log(
          chalk.yellow("\n  Cap valor especificat. Usa --api-url o --anthropic-key.\n")
        );
        return;
      }

      saveConfig(cfg);
      console.log(chalk.green("\n  Configuració guardada correctament.\n"));
    });
}
