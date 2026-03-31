const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8080`;

const authService = {
  loginWithGoogle: () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include"
    });

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
