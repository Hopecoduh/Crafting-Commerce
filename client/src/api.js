// client/src/api.js

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
    ...(options.headers || {}),
  };

  if (!headers["Content-Type"] && options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds

  let res;
  try {
    res = await fetch(path, { ...options, headers, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (data && typeof data === "object" && "ok" in data) {
    if (data.ok === true) return data.data;

    const err = new Error(data.error || "Request failed");
    err.details = data.details ?? null;
    err.status = res.status;
    throw err;
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || "Request failed";
    const err = new Error(msg);
    err.details = data?.details ?? null;
    err.status = res.status;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
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

  // Inventory
  materials: () => request("/api/inventory/materials"),
  items: () => request("/api/inventory/items"),

  gather: (material_id) =>
    request("/api/inventory/gather", {
      method: "POST",
      body: JSON.stringify({ material_id }),
    }),

  // Actions
  hunt: () =>
    request("/api/gather/hunt", {
      method: "POST",
    }),

  mine: () =>
    request("/api/gather/mine", {
      method: "POST",
    }),

  gatherWood: () =>
    request("/api/gather/wood", {
      method: "POST",
    }),

  gatherPlants: () =>
    request("/api/gather/plants", {
      method: "POST",
    }),

  // Crafting
  recipes: () => request("/api/crafting/recipes"),

  craft: (recipe_id) =>
    request("/api/crafting/craft", {
      method: "POST",
      body: JSON.stringify({ recipe_id }),
    }),

  // Shop
  listings: () => request("/api/shop/listings"),
  myListings: () => request("/api/shop/my-listings"),

  listItem: (body) =>
    request("/api/shop/list", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  buy: (listingId) =>
    request(`/api/shop/buy/${listingId}`, {
      method: "POST",
    }),

  updateListingPrice: (listingId, price) =>
    request(`/api/shop/my-listings/${listingId}`, {
      method: "PATCH",
      body: JSON.stringify({ price }),
    }),

  unlist: (listingId) =>
    request(`/api/shop/unlist/${listingId}`, {
      method: "POST",
    }),
};
