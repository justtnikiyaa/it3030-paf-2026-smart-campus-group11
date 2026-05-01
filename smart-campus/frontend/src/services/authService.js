const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const GOOGLE_OAUTH_LOGIN_URL = `${API_BASE_URL}/oauth2/authorization/google`;
const AUTH_ME_TIMEOUT_MS = 60000; // Increased to 60s to allow Render free tier backend to spin up

const authService = {
  loginWithGoogle: () => {
    window.location.href = GOOGLE_OAUTH_LOGIN_URL;
  },

  getMe: async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), AUTH_ME_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        signal: controller.signal
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new Error("Authentication request timed out");
      }
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }

    if (response.redirected || response.status === 401) return null;
    if (!response.ok) throw new Error("Failed to fetch current user");

    return response.json();
  },

  logout: async () => {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include"
    });
  }
};

export default authService;
