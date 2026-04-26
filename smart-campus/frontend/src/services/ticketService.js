const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const ticketService = {
  // ── CREATE ────────────────────────────────────────────────────────────────
  createTicket: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/api/tickets`, {
      method: "POST",
      credentials: "include",
      body: formData, // FormData with images + JSON fields as form params
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create ticket");
    }
    return response.json();
  },

  // ── READ ──────────────────────────────────────────────────────────────────
  getAllTickets: async () => {
    const res = await fetch(`${API_BASE_URL}/api/tickets`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch tickets");
    return res.json();
  },

  getMyTickets: async () => {
    const res = await fetch(`${API_BASE_URL}/api/tickets/my`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch my tickets");
    return res.json();
  },

  getAssignedTickets: async () => {
    const res = await fetch(`${API_BASE_URL}/api/tickets/assigned`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch assigned tickets");
    return res.json();
  },

  getTicketById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/tickets/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch ticket");
    return res.json();
  },

  // ── UPDATE STATUS ─────────────────────────────────────────────────────────
  updateStatus: async (id, status, resolutionNotes = "") => {
    const res = await fetch(`${API_BASE_URL}/api/tickets/${id}/status`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, resolutionNotes }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update status");
    }
    return res.json();
  },

  // ── ASSIGN TECHNICIAN ─────────────────────────────────────────────────────
  assignTechnician: async (ticketId, technicianUserId) => {
    const res = await fetch(
      `${API_BASE_URL}/api/tickets/${ticketId}/assign?technicianUserId=${technicianUserId}`,
      { method: "PUT", credentials: "include" }
    );
    if (!res.ok) throw new Error("Failed to assign technician");
    return res.json();
  },

  getTechnicians: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/technicians`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch technicians");
    return res.json();
  },

  // ── COMMENTS ──────────────────────────────────────────────────────────────
  addComment: async (ticketId, message) => {
    const res = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/comments`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Failed to add comment");
    return res.json();
  },

  editComment: async (ticketId, commentId, message) => {
    const res = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/comments/${commentId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Failed to edit comment");
    return res.json();
  },

  deleteComment: async (ticketId, commentId) => {
    const res = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/comments/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete comment");
  },
};

export default ticketService;
