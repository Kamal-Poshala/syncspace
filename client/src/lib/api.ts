const API_URL = "/api";

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(authHeader as Record<string, string>),
      ...(headers as Record<string, string>),
    },
    ...rest,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API Request Failed");
  }

  return response.json();
}
