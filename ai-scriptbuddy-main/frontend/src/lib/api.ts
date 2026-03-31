export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const userId = localStorage.getItem("userId");
  
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId || "",
      ...(options.headers || {}),
    },
  });

  // Handle potential non-JSON errors (like Vite fallback HTML)
  const contentType = res.headers.get("content-type");
  let payload;
  
  if (contentType && contentType.includes("application/json")) {
    payload = await res.json();
  } else {
    const text = await res.text();
    console.error("Non-JSON response:", text);
    throw new Error(`Server returned unexpected format. Please ensure backend is running.`);
  }

  if (!res.ok) {
    throw new Error(payload.error || `API error ${res.status}`);
  }
  return payload;
}
