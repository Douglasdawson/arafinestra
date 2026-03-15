import { createInterface } from "readline";
import chalk from "chalk";
import { loadConfig, saveConfig } from "../config.js";

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function promptPassword(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    // Mute stdout to hide password input
    const origWrite = process.stdout.write.bind(process.stdout);
    let muted = false;

    process.stdout.write = ((
      chunk: string | Uint8Array,
      encodingOrCb?: BufferEncoding | ((err?: Error) => void),
      cb?: (err?: Error) => void
    ): boolean => {
      if (muted) {
        // Only suppress characters that are the user's typed input (not the prompt itself)
        return true;
      }
      if (typeof encodingOrCb === "function") {
        return origWrite(chunk, encodingOrCb);
      }
      return origWrite(chunk, encodingOrCb, cb);
    }) as typeof process.stdout.write;

    rl.question(question, (answer) => {
      muted = false;
      process.stdout.write = origWrite;
      console.log(); // newline after hidden input
      rl.close();
      resolve(answer);
    });

    muted = true;
  });
}

export async function loginCommand(): Promise<void> {
  const config = loadConfig();

  console.log(chalk.blue.bold("\n  ARA FINESTRA CLI — Login\n"));
  console.log(chalk.dim(`  Server: ${config.apiUrl}\n`));

  const username = await prompt("  Username: ");
  const password = await promptPassword("  Password: ");

  if (!username || !password) {
    console.error(chalk.red("  Username and password are required."));
    process.exit(1);
  }

  try {
    const res = await fetch(`${config.apiUrl.replace(/\/$/, "")}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      redirect: "manual",
    });

    if (res.ok || (res.status >= 300 && res.status < 400)) {
      const setCookie = res.headers.get("set-cookie");
      if (setCookie) {
        // Extract the session cookie (first part before any attributes)
        const cookieValue = setCookie.split(";")[0];
        config.sessionCookie = cookieValue;
        saveConfig(config);
        console.log(chalk.green.bold("\n  ✓ Logged in successfully!\n"));
      } else {
        console.error(chalk.red("\n  Login succeeded but no session cookie received."));
        process.exit(1);
      }
    } else {
      const body = await res.text();
      let message = "Invalid credentials";
      try {
        const json = JSON.parse(body);
        if (json.message) message = json.message;
      } catch {
        // use default message
      }
      console.error(chalk.red(`\n  ✗ Login failed: ${message}\n`));
      process.exit(1);
    }
  } catch (err: any) {
    console.error(chalk.red(`\n  ✗ Connection error: ${err.message}\n`));
    process.exit(1);
  }
}
