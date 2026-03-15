import chalk from "chalk";
import { loadConfig } from "./config.js";

export async function api(
  method: string,
  path: string,
  body?: unknown
): Promise<Response> {
  const config = loadConfig();

  if (!config.sessionCookie) {
    console.error(chalk.red("Not logged in. Run: npm run cli -- login"));
    process.exit(1);
  }

  const baseUrl = config.apiUrl.replace(/\/$/, "");
  const url = `${baseUrl}${path}`;

  const headers: Record<string, string> = {
    Cookie: config.sessionCookie,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      redirect: "manual",
    });
  } catch (err: any) {
    console.error(
      chalk.red(`Connection error: ${err.message ?? "server unreachable"}`)
    );
    process.exit(1);
  }

  if (res.status === 401) {
    console.error(
      chalk.red("Session expired. Please login again: npm run cli -- login")
    );
    process.exit(1);
  }

  return res;
}

export async function apiGet(path: string): Promise<Response> {
  return api("GET", path);
}

export async function apiPost(path: string, body?: unknown): Promise<Response> {
  return api("POST", path, body);
}

export async function apiPatch(
  path: string,
  body?: unknown
): Promise<Response> {
  return api("PATCH", path, body);
}

export async function apiDelete(path: string): Promise<Response> {
  return api("DELETE", path);
}
