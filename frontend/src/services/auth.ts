const TOKEN_KEY = "clauselens_access_token";
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export function getAccessToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveAccessToken(token: string, rememberMe = false): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    (rememberMe ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  } catch {
    throw new Error("Your browser is blocking sign-in storage. Enable site storage and try again.");
  }
}

export function clearAccessToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage may be disabled; there is no browser-side token to clear.
  }
}

async function readError(response: Response, fallback: string): Promise<Error> {
  try {
    const data = await response.json() as { detail?: unknown; message?: unknown };
    if (typeof data.detail === "string") return new Error(data.detail);
    if (typeof data.message === "string") return new Error(data.message);
  } catch {
    // Use the action-specific fallback for an empty or non-JSON error response.
  }
  return new Error(fallback);
}

export async function loginUser(email: string, password: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ username: email, password }),
    });
  } catch {
    throw new Error("Cannot reach the sign-in service. Check that the ClauseLens API is running.");
  }

  if (!response.ok) {
    throw await readError(response, response.status === 401
      ? "Email or password is incorrect. Please try again."
      : "Unable to sign in right now. Please try again.");
  }

  const data = await response.json() as { access_token?: unknown };
  if (typeof data.access_token !== "string" || !data.access_token.trim()) {
    throw new Error("The sign-in service did not return an access token.");
  }
  return data.access_token;
}

export async function registerUser(name: string, email: string, password: string): Promise<void> {
  const params = new URLSearchParams({ name, email, password });
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/register?${params.toString()}`, {
      method: "POST",
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new Error("Cannot reach the registration service. Check that the ClauseLens API is running.");
  }

  if (!response.ok) {
    throw await readError(response, "Unable to create your account. Please try again.");
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  const token = getAccessToken();
  if (!token) throw new Error("You are not signed in.");

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("Cannot reach the ClauseLens API.");
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) clearAccessToken();
    throw await readError(response, "Your session has expired. Please sign in again.");
  }

  return response.json() as Promise<AuthUser>;
}
