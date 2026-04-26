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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: "",
    description: "",
    resource: "",
    category: "OTHER",
    priority: "MEDIUM",
    preferredContact: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [imageError, setImageError] = useState(null);

  // ── Field-level validation ──────────────────────────────────────────────
  const validate = (name, value) => {
    switch (name) {
      case "subject":
        if (!value.trim()) return "Subject is required.";
        if (value.trim().length < 5) return "Subject must be at least 5 characters.";
        if (value.length > 200) return "Subject must not exceed 200 characters.";
        return null;
      case "description":
        if (!value.trim()) return "Description is required.";
        if (value.trim().length < 10) return "Description must be at least 10 characters.";
        if (value.length > 2000) return "Description must not exceed 2000 characters.";
        return null;
      case "resource":
        if (value.length > 300) return "Location must not exceed 300 characters.";
        return null;
      case "preferredContact":
        if (value.length > 300) return "Contact details must not exceed 300 characters.";
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field has been touched
    if (touched[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  // ── Image handling ──────────────────────────────────────────────────────
  const addFiles = useCallback((newFiles) => {
    setImageError(null);
    const allFiles = Array.from(newFiles);

    // Check for non-image files
    const nonImages = allFiles.filter((f) => !f.type.startsWith("image/"));
    if (nonImages.length > 0) {
      setImageError("Only image files (JPG, PNG, GIF, etc.) are allowed.");
      return;
    }

    // Check for oversized files
    const oversized = allFiles.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      setImageError(`File "${oversized[0].name}" exceeds the 5 MB size limit.`);
      return;
    }

    const remaining = 3 - images.length;
    if (remaining <= 0) {
      setImageError("Maximum 3 images allowed.");
      return;
    }

    const toAdd = allFiles.slice(0, remaining);
    setImages((prev) => [...prev, ...toAdd]);
    setPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
  }, [images]);

  const removeImage = (idx) => {
    URL.revokeObjectURL(previews[idx]);
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setImageError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // ── Full form validation on submit ──────────────────────────────────────
  const validateAll = () => {
    const errors = {};
    errors.subject = validate("subject", form.subject);
    errors.description = validate("description", form.description);
    errors.resource = validate("resource", form.resource);
    errors.preferredContact = validate("preferredContact", form.preferredContact);

    // Remove null entries
    Object.keys(errors).forEach((k) => { if (!errors[k]) delete errors[k]; });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Mark all required fields as touched
    setTouched({ subject: true, description: true, resource: true, preferredContact: true });

    const errors = validateAll();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Please fix the validation errors below before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("subject", form.subject.trim());
      formData.append("description", form.description.trim());
      formData.append("resource", form.resource.trim());
      formData.append("category", form.category);
      formData.append("priority", form.priority);
      if (form.preferredContact.trim()) formData.append("preferredContact", form.preferredContact.trim());
      images.forEach((img) => formData.append("images", img));

      await ticketService.createTicket(formData);
      navigate("/tickets");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Helper: input border class ──────────────────────────────────────────
  const inputClass = (name) => {
    const base = "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition dark:bg-[#0d1628] dark:text-white dark:placeholder-slate-500";
    if (touched[name] && fieldErrors[name]) {
      return `${base} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500`;
    }
    if (touched[name] && !fieldErrors[name] && form[name]?.trim()) {
      return `${base} border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-500`;
    }
    return `${base} border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600`;
  };

  const hasErrors = Object.values(fieldErrors).some(Boolean);

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

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Subject */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={200}
                placeholder="e.g. Air conditioning not working in Lab 3B"
                className={inputClass("subject")}
              />
              <div className="mt-1 flex items-center justify-between">
                {touched.subject && fieldErrors.subject ? (
                  <p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.subject}</p>
                ) : <span />}
                <p className="text-[11px] text-slate-400">{form.subject.length}/200</p>
              </div>
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
                onBlur={handleBlur}
                maxLength={300}
                placeholder="e.g. Building A, Room 301"
                className={inputClass("resource")}
              />
              {touched.resource && fieldErrors.resource && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.resource}</p>
              )}
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
                onBlur={handleBlur}
                maxLength={2000}
                rows={4}
                placeholder="Describe the issue in detail..."
                className={`${inputClass("description")} resize-none`}
              />
              <div className="mt-1 flex items-center justify-between">
                {touched.description && fieldErrors.description ? (
                  <p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.description}</p>
                ) : <span />}
                <p className={`text-[11px] ${form.description.length > 1900 ? 'text-amber-500 font-medium' : 'text-slate-400'}`}>
                  {form.description.length}/2000
                </p>
              </div>
            </div>

            {/* Preferred Contact */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Preferred Contact Details
              </label>
              <input
                name="preferredContact"
                value={form.preferredContact}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={300}
                placeholder="e.g. 077-123-4567 or john@university.edu"
                className={inputClass("preferredContact")}
              />
              {touched.preferredContact && fieldErrors.preferredContact && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.preferredContact}</p>
              )}
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
                  imageError
                    ? "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/10"
                    : isDragging
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
              {imageError && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{imageError}</p>
              )}
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
                disabled={isSubmitting || hasErrors}
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
