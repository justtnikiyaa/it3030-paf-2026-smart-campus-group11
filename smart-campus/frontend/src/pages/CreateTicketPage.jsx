import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ticketService from "../services/ticketService";

const CATEGORIES = ["ELECTRICAL", "PLUMBING", "IT", "HVAC", "SECURITY", "OTHER"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

const PRIORITY_COLORS = {
  LOW: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  MEDIUM: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  HIGH: "bg-red-500/20 text-red-700 dark:text-red-300",
};

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: "",
    description: "",
    resource: "",
    category: "OTHER",
    priority: "MEDIUM",
  });
  const [images, setImages] = useState([]); // File[]
  const [previews, setPreviews] = useState([]); // URL strings
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addFiles = useCallback((newFiles) => {
    const valid = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    const remaining = 3 - images.length;
    const toAdd = valid.slice(0, remaining);
    if (!toAdd.length) return;
    setImages((prev) => [...prev, ...toAdd]);
    setPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
  }, [images]);

  const removeImage = (idx) => {
    URL.revokeObjectURL(previews[idx]);
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("subject", form.subject);
      formData.append("description", form.description);
      formData.append("resource", form.resource);
      formData.append("category", form.category);
      formData.append("priority", form.priority);
      images.forEach((img) => formData.append("images", img));

      await ticketService.createTicket(formData);
      navigate("/tickets");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Submit Incident Ticket">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_14px_36px_-26px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:border-cyan-300/20 dark:bg-[#111a2d]/90">
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Report an Incident
          </h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Describe the issue and our technicians will be assigned promptly.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Subject */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="e.g. Air conditioning not working in Lab 3B"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-[#0d1628] dark:text-white dark:placeholder-slate-500"
              />
            </div>

            {/* Resource */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Location / Resource
              </label>
              <input
                name="resource"
                value={form.resource}
                onChange={handleChange}
                maxLength={300}
                placeholder="e.g. Building A, Room 301"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-[#0d1628] dark:text-white dark:placeholder-slate-500"
              />
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-[#0d1628] dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-[#0d1628] dark:text-white"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
                  ))}
                </select>
                {form.priority && (
                  <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PRIORITY_COLORS[form.priority]}`}>
                    {form.priority}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                maxLength={2000}
                rows={4}
                placeholder="Describe the issue in detail..."
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-[#0d1628] dark:text-white dark:placeholder-slate-500"
              />
              <p className="mt-1 text-right text-[11px] text-slate-400">{form.description.length}/2000</p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Attach Images <span className="text-slate-400">(up to 3, max 5 MB each)</span>
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 transition-colors ${
                  isDragging
                    ? "border-cyan-400 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-900/20"
                    : "border-slate-300 bg-slate-50 hover:border-cyan-400 dark:border-slate-600 dark:bg-[#0d1628] dark:hover:border-cyan-500"
                }`}
                onClick={() => images.length < 3 && document.getElementById("img-upload").click()}
              >
                <input
                  id="img-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
                {previews.length === 0 ? (
                  <>
                    <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Drag &amp; drop or <span className="font-medium text-cyan-600 dark:text-cyan-400">browse</span>
                    </p>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {previews.map((src, idx) => (
                      <div key={idx} className="group relative">
                        <img
                          src={src}
                          alt={`preview-${idx}`}
                          className="h-20 w-20 rounded-lg object-cover shadow ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {previews.length < 3 && (
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 dark:border-slate-600">
                        +
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/tickets")}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-cyan-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-cyan-700 disabled:opacity-60 dark:bg-cyan-500 dark:hover:bg-cyan-600"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
