// client/src/components/actions/actionApi.js
import { getToken } from "../../api.js";

const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function postAction(url, body) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text().catch(() => "");
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(
      data?.error || data?.message || `Request failed (${res.status})`,
    );
  }

  return data; // gather returns { ok:true, drops }
}
