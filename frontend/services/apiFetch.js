const API = "http://localhost:3000/api";


async function apiFetch(path, options = {}) {
  const res  = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error en el servidor.");
  return data;
}