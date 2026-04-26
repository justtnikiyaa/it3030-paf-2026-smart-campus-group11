import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import TicketCommentSection from "../components/tickets/TicketCommentSection";
import ticketService from "../services/ticketService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const STATUS_STYLES = {
  OPEN:        "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  IN_PROGRESS: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  RESOLVED:    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  CLOSED:      "bg-slate-400/20 text-slate-600 dark:text-slate-400",
  REJECTED:    "bg-red-500/15 text-red-700 dark:text-red-300",
};

const PRIORITY_STYLES = {
  LOW:    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  MEDIUM: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  HIGH:   "bg-red-500/15 text-red-700 dark:text-red-300",
};

const ALL_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];

function Badge({ label, cls }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${cls}`}>
      {label.replace("_", " ")}
    </span>
  );
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  // Status update panel (for TECHNICIAN / ADMIN)
  const [newStatus, setNewStatus] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Assign panel (for ADMIN)
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);

  const canUpdateStatus = user?.role === "ADMIN" || user?.role === "TECHNICIAN";

  const load = async () => {
    try {
      const data = await ticketService.getTicketById(id);
      setTicket(data);
      setNewStatus(data.status);
      setResolutionNotes(data.resolutionNotes || "");
      if (user?.role === "ADMIN") {
        setSelectedTechnician(data.assignedTechnicianId || "");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTechnicians = async () => {
    if (user?.role !== "ADMIN") return;
    try {
      const techData = await ticketService.getTechnicians();
      setTechnicians(techData);
    } catch (err) {
      console.error("Failed to load technicians", err);
    }
  };

  useEffect(() => { 
    load(); 
    loadTechnicians();
  }, [id, user?.role]);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const updated = await ticketService.updateStatus(id, newStatus, resolutionNotes);
      setTicket(updated);
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignTechnician = async () => {
    setIsAssigning(true);
    setAssignError(null);
    try {
      const updated = await ticketService.assignTechnician(id, selectedTechnician);
      setTicket(updated);
    } catch (err) {
      setAssignError(err.message);
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) return (
    <AppLayout title="Ticket Detail">
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout title="Ticket Detail">
      <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-300">
        {error}
      </div>
    </AppLayout>
  );

  return (
    <AppLayout title={`Ticket #${ticket.id}`}>
      {/* Lightbox */}
      {lightboxSrc && (
        <div
          onClick={() => setLightboxSrc(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <img src={lightboxSrc} alt="full" className="max-h-[90vh] max-w-full rounded-xl shadow-2xl" />
        </div>
      )}

      <div className="mx-auto max-w-3xl space-y-5">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Main card */}
        <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_14px_36px_-26px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:border-cyan-300/20 dark:bg-[#111a2d]/90">
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="mb-1 text-xs text-slate-400">Ticket #{ticket.id}</p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {ticket.subject}
              </h1>
            </div>
            <div className="flex gap-2">
              <Badge label={ticket.priority} cls={PRIORITY_STYLES[ticket.priority]} />
              <Badge label={ticket.status} cls={STATUS_STYLES[ticket.status]} />
            </div>
          </div>

          {/* Meta grid */}
          <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm dark:bg-[#0d1628] sm:grid-cols-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Category</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{ticket.category}</p>
            </div>
            {ticket.resource && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Location</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{ticket.resource}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Submitted by</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{ticket.ownerName}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Technician</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {ticket.assignedTechnicianName || "Unassigned"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Created</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Updated</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {new Date(ticket.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Description</h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">{ticket.description}</p>
          </div>

          {/* Resolution notes */}
          {ticket.resolutionNotes && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/30 dark:bg-emerald-900/10">
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                Resolution Notes
              </h2>
              <p className="text-sm leading-relaxed text-emerald-800 dark:text-emerald-200">
                {ticket.resolutionNotes}
              </p>
            </div>
          )}

          {/* Image gallery */}
          {ticket.imageUrls?.length > 0 && (
            <div className="mb-4">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Attachments ({ticket.imageUrls.length})
              </h2>
              <div className="flex flex-wrap gap-3">
                {ticket.imageUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxSrc(`${API_BASE_URL}${url}`)}
                    className="group relative overflow-hidden rounded-xl shadow ring-1 ring-slate-200 transition hover:shadow-md dark:ring-slate-700"
                  >
                    <img
                      src={`${API_BASE_URL}${url}`}
                      alt={`attachment-${i + 1}`}
                      className="h-24 w-24 object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                      <svg className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Status update & Assignment panel for Technician / Admin */}
        {(canUpdateStatus || user?.role === "ADMIN") && (
          <div className="grid gap-5 md:grid-cols-2">
            {canUpdateStatus && (
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-5 shadow-sm dark:border-amber-500/20 dark:bg-amber-900/10">
                <h2 className="mb-3 font-semibold text-amber-800 dark:text-amber-300">Update Ticket Status</h2>

                {updateError && (
                  <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-300">
                    {updateError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-amber-700 dark:text-amber-400">Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-amber-600/40 dark:bg-[#0d1628] dark:text-white"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-amber-700 dark:text-amber-400">
                      Resolution Notes (optional)
                    </label>
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      rows={3}
                      placeholder="Describe the resolution steps taken..."
                      className="w-full resize-none rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-amber-600/40 dark:bg-[#0d1628] dark:text-white dark:placeholder-slate-500"
                    />
                  </div>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                    className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-amber-700 disabled:opacity-60 dark:bg-amber-500 dark:hover:bg-amber-600"
                  >
                    {isUpdating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>
            )}

            {user?.role === "ADMIN" && (
              <div className="rounded-2xl border border-purple-200/80 bg-purple-50/60 p-5 shadow-sm dark:border-purple-500/20 dark:bg-purple-900/10">
                <h2 className="mb-3 font-semibold text-purple-800 dark:text-purple-300">Assign Technician</h2>

                {assignError && (
                  <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-300">
                    {assignError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-purple-700 dark:text-purple-400">Select Technician</label>
                    <select
                      value={selectedTechnician}
                      onChange={(e) => setSelectedTechnician(e.target.value)}
                      className="w-full rounded-lg border border-purple-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-purple-600/40 dark:bg-[#0d1628] dark:text-white"
                    >
                      <option value="">-- Unassigned --</option>
                      {technicians.map((t) => (
                        <option key={t.id} value={t.id}>{t.fullName} ({t.email})</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAssignTechnician}
                    disabled={isAssigning || !selectedTechnician || String(selectedTechnician) === String(ticket.assignedTechnicianId)}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-purple-700 disabled:opacity-60 dark:bg-purple-500 dark:hover:bg-purple-600"
                  >
                    {isAssigning ? "Assigning..." : "Assign"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comments */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.3)] backdrop-blur-sm dark:border-cyan-300/20 dark:bg-[#111a2d]/90">
          <TicketCommentSection
            ticketId={Number(id)}
            comments={ticket.comments || []}
            onRefresh={load}
          />
        </div>
      </div>
    </AppLayout>
  );
}
