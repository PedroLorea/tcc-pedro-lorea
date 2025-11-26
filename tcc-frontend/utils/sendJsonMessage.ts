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

  // Se der erro → captura o STATUS e o JSON também
  if (!res.ok) {
    let data = null;

    try {
      data = await res.json();
    } catch (e) {
      // corpo vazio → deixa null
    }

    throw {
      status: res.status,
      statusText: res.statusText,
      data,
    };
  }

  // Em sucesso, retorna o JSON
  return res.json();
}
