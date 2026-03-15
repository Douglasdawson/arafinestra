#!/usr/bin/env node

import { Command } from "commander";
import { loginCommand } from "./commands/login.js";

const program = new Command();

program
  .name("arafinestra")
  .description("ARA FINESTRA — CLI for managing your website")
  .version("1.0.0");

program
  .command("login")
  .description("Authenticate with the ARA FINESTRA server")
  .action(loginCommand);

program.parse();
