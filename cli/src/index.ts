#!/usr/bin/env node

import { Command } from "commander";
import { loginCommand } from "./commands/login.js";
import { registerConfigCommand } from "./commands/config.js";
import { registerLeadsCommand } from "./commands/leads.js";
import { registerBlogCommand } from "./commands/blog.js";
import { registerSeoCommand } from "./commands/seo.js";
import { registerPressupostCommand } from "./commands/pressupost.js";

const program = new Command();

program
  .name("arafinestra")
  .description("ARA FINESTRA — CLI for managing your website")
  .version("1.0.0");

program
  .command("login")
  .description("Authenticate with the ARA FINESTRA server")
  .action(loginCommand);

registerConfigCommand(program);
registerLeadsCommand(program);
registerBlogCommand(program);
registerSeoCommand(program);
registerPressupostCommand(program);

program.parse();
