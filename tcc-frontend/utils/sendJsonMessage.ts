export async function sendJsonMessage(
  metodo: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  additionalUrl: string = "",
  body?: any
) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const fullUrl = additionalUrl ? `${url}${additionalUrl}/` : url;

  const res = await fetch(fullUrl, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Erro na requisição: ${res.statusText}`);
  }

  return res.json();
}
