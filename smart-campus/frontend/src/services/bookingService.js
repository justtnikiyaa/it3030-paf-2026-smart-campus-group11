const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const bookingService = {
  // USER
  createBooking: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }
    return response.json();
  },

  getMyBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/api/bookings/me`, {
      credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to fetch bookings");
    return response.json();
  },

  cancelBooking: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${id}/cancel`, {
      method: "PATCH",
      credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to cancel booking");
    return response.json();
  },

  // ADMIN
  getAllBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
      credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to fetch all bookings");
    return response.json();
  },

  approveBooking: async (id, adminReason) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ adminReason })
    });
    if (!response.ok) throw new Error("Failed to approve booking");
    return response.json();
  },

  rejectBooking: async (id, adminReason) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${id}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ adminReason })
    });
    if (!response.ok) throw new Error("Failed to reject booking");
    return response.json();
  }
};
