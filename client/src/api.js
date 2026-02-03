export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });

  const data = await res.json().catch(() => null);

  // If backend already used { ok:false, error, details }, normalize that
  if (!res.ok && data && typeof data === "object" && "ok" in data) {
    const err = new Error(data.error || "Request failed");
    err.details = data.details ?? null;
    throw err;
  }

  // Otherwise handle plain HTTP errors
  if (!res.ok) {
    const msg = data?.error || data?.message || "Request failed";
    const err = new Error(msg);
    err.details = data?.details ?? null;
    throw err;
  }

  if (data && typeof data === "object" && "ok" in data) {
    if (data.ok === true) return data.data;
    const msg = data.error || "Request failed";
    const err = new Error(msg);
    err.details = data.details ?? null;
    throw err;
  }

  return data;
}

export const api = {
  register: (body) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () => request("/api/auth/me"),

  materials: () => request("/api/inventory/materials"),

  gather: (material_id) =>
    request("/api/inventory/gather", {
      method: "POST",
      body: JSON.stringify({ material_id }),
    }),

  recipes: () => request("/api/crafting/recipes"),

  craft: (recipe_id) =>
    request("/api/crafting/craft", {
      method: "POST",
      body: JSON.stringify({ recipe_id }),
    }),

  listings: () => request("/api/shop/listings"),

  listItem: (body) =>
    request("/api/shop/list", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  items: () => request("/api/inventory/items"),
};
