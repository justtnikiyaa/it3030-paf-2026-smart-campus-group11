const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (response.redirected || response.status === 401) {
    throw new Error("Please sign in again.");
  }

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data?.message || data?.error || message;
    } catch {
      // ignore non-json error body
    }
    throw new Error(message);
  }

  return response.json();
}

const notificationPreferenceService = {
  getMyPreferences: async () => request("/api/notification-preferences/me", { method: "GET" }),

  updateMyPreferences: async (payload) =>
    request("/api/notification-preferences/me", {
      method: "PUT",
      body: JSON.stringify(payload)
    })
};

export default notificationPreferenceService;
