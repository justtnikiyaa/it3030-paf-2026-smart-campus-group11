import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Info } from "lucide-react";

export default function ResourceForm({ initialData, onSubmit, isLoading, mode = "add" }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "LECTURE_HALL",
    capacity: "",
    location: "",
    availabilityWindows: "",
    status: "ACTIVE",
    description: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "LECTURE_HALL",
        capacity: initialData.capacity || "",
        location: initialData.location || "",
        availabilityWindows: initialData.availabilityWindows || "",
        status: initialData.status || "ACTIVE",
        description: initialData.description || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.capacity === "") {
      payload.capacity = null; // Backend accepts null for equipment
    } else {
      payload.capacity = parseInt(payload.capacity, 10);
    }
    onSubmit(payload);
  };

  return (
    <div className="w-full relative">
      {/* Sticky Back Button Container */}
      <div className="sticky top-4 z-40 w-full pointer-events-none flex justify-start">
        <button 
          onClick={() => navigate(-1)} 
          className="pointer-events-auto p-2.5 bg-white dark:bg-[#111c33] shadow-md border border-slate-200 dark:border-cyan-300/30 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full transition-colors flex-shrink-0"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-3xl mx-auto pb-8 px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="mb-8 flex justify-center">
          <h1 className="text-3xl font-extrabold text-slate-700 dark:text-white tracking-tight flex items-center gap-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 text-center">
              {mode === "add" ? "Add New Resources" : "Edit Resource"}
            </span>
          </h1>
        </div>

        <div className="bg-white dark:bg-[#111c33] rounded-2xl shadow-xl border border-slate-100 dark:border-cyan-300/20 overflow-hidden backdrop-blur-sm backdrop-filter">
        <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Resource Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Turing Lab"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-cyan-300/20 text-slate-900 dark:text-white dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Resource Type *</label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-cyan-300/20 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none"
              >
                <option value="LECTURE_HALL" className="dark:bg-[#111c33]">Lecture Hall</option>
                <option value="LAB" className="dark:bg-[#111c33]">Lab</option>
                <option value="MEETING_ROOM" className="dark:bg-[#111c33]">Meeting Room</option>
                <option value="EQUIPMENT" className="dark:bg-[#111c33]">Equipment</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Status *</label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-cyan-300/20 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none"
              >
                <option value="ACTIVE" className="dark:bg-[#111c33]">Active</option>
                <option value="OUT_OF_SERVICE" className="dark:bg-[#111c33]">Out of Service</option>
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 50"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-cyan-300/20 text-slate-900 dark:text-white dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Block A, Room 101"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-cyan-300/20 text-slate-900 dark:text-white dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Availability Windows */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="availabilityWindows" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                Availability Windows
                <Info className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </label>
              <input
                type="text"
                id="availabilityWindows"
                name="availabilityWindows"
                value={formData.availabilityWindows}
                onChange={handleChange}
                placeholder="e.g., Mon-Fri 08:00-18:00"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-cyan-300/20 text-slate-900 dark:text-white dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description about the resource..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-cyan-300/20 text-slate-900 dark:text-white dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
              />
            </div>
            
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-cyan-300/20 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-70 transition-all shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Resource
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
