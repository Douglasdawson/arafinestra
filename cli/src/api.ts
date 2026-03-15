import chalk from "chalk";
import { loadConfig } from "./config.js";

function getBaseUrl(): string {
  const config = loadConfig();
  return config.apiUrl.replace(/\/$/, "");
}

function getCookie(): string {
  const config = loadConfig();
  if (!config.sessionCookie) {
    console.error(chalk.red("Not logged in. Run: npm run cli -- login"));
    process.exit(1);
  }
  return config.sessionCookie;
}

export async function api(
  method: string,
  path: string,
  body?: unknown
): Promise<Response> {
  const url = `${getBaseUrl()}${path}`;
  const cookie = getCookie();

  const headers: Record<string, string> = {
    Cookie: cookie,
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });

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
