const BASE = "http://localhost:8081/api";

export const getToken = () => localStorage.getItem("token");
export const saveToken = (t) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body && JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Try again.");
  return data;
}

export const register = (payload) => request("/auth/register", { method: "POST", body: payload });
export const login = (payload) => request("/auth/login", { method: "POST", body: payload });
export const resetPassword = (payload) => request("/auth/reset-password", { method: "POST", body: payload });
export const fetchMe = () => request("/me", { auth: true });