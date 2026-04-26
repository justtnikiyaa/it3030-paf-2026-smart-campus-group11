import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

function toFriendlyError(error) {
  if (error?.response?.status === 401) return "Please sign in again.";
  if (error?.response?.status === 403) return "You don't have permission to perform this action.";
  return error?.response?.data?.message || error?.message || "Request failed";
}

const resourceService = {
  getAllResources: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.location) params.append("location", filters.location);
      if (filters.minCapacity) params.append("minCapacity", filters.minCapacity);

      const { data } = await api.get(`/api/resources?${params.toString()}`);
      return data;
    } catch (error) {
      throw new Error(toFriendlyError(error));
    }
  },

  getResourceById: async (id) => {
    try {
      const { data } = await api.get(`/api/resources/${id}`);
      return data;
    } catch (error) {
      throw new Error(toFriendlyError(error));
    }
  },

  createResource: async (resourceData) => {
    try {
      const { data } = await api.post("/api/resources", resourceData);
      return data;
    } catch (error) {
      throw new Error(toFriendlyError(error));
    }
  },

  updateResource: async (id, resourceData) => {
    try {
      const { data } = await api.put(`/api/resources/${id}`, resourceData);
      return data;
    } catch (error) {
      throw new Error(toFriendlyError(error));
    }
  },

  deleteResource: async (id) => {
    try {
      await api.delete(`/api/resources/${id}`);
      return { ok: true };
    } catch (error) {
      throw new Error(toFriendlyError(error));
    }
  },

  updateResourceStatus: async (id, status) => {
    try {
      const { data } = await api.patch(`/api/resources/${id}/status`, { status });
      return data;
    } catch (error) {
      throw new Error(toFriendlyError(error));
    }
  }
};

export default resourceService;
