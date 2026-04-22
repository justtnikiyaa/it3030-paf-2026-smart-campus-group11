import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ticketService from "../services/ticketService";

const STATUS_STYLES = {
  OPEN:        { badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300",     dot: "bg-blue-500" },
  IN_PROGRESS: { badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",   dot: "bg-amber-500" },
  RESOLVED:    { badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  CLOSED:      { badge: "bg-slate-400/20 text-slate-600 dark:text-slate-400",   dot: "bg-slate-400" },
  REJECTED:    { badge: "bg-red-500/15 text-red-700 dark:text-red-300",         dot: "bg-red-500" },
};

const PRIORITY_STYLES = {
  LOW:    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  MEDIUM: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  HIGH:   "bg-red-500/15 text-red-700 dark:text-red-300",
};

const ALL_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];

function TicketKanbanCard({ ticket, onStatusChange, isUpdating }) {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState(ticket.status);
  const [notes, setNotes] = useState(ticket.resolutionNotes || "");
  const [expanded, setExpanded] = useState(false);

  const handleUpdate = async () => {
    await onStatusChange(ticket.id, selectedStatus, notes);
  };

  const s = STATUS_STYLES[ticket.status] || STATUS_STYLES.OPEN;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/90 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.3)] backdrop-blur-sm dark:border-cyan-300/20 dark:bg-[#111a2d]/90 overflow-hidden">
      {/* Priority strip */}
      <div className={`h-1 w-full ${ticket.priority === "HIGH" ? "bg-red-500" : ticket.priority === "MEDIUM" ? "bg-amber-400" : "bg-emerald-400"}`} />

      <div className="p-4">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-400">#{ticket.id}</p>
            <h3 className="line-clamp-1 font-semibold text-slate-900 dark:text-white">{ticket.subject}</h3>
          </div>
          <div className="flex shrink-0 gap-1">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${PRIORITY_STYLES[ticket.priority]}`}>
              {ticket.priority}
            </span>
          </div>
        </div>

        {/* Info */}
        {ticket.resource && (
          <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">📍 {ticket.resource}</p>
        )}
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
          🗂 {ticket.category} · 👤 {ticket.ownerName}
        </p>

        {/* Current status badge */}
        <div className="mb-3 flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${s.dot}`} />
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${s.badge}`}>
            {ticket.status.replace("_", " ")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            View Details
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-500/30 dark:text-amber-300"
          >
            {expanded ? "Close" : "Update"}
          </button>
        </div>

        {/* Expandable update panel */}
        {expanded && (
          <div className="mt-3 space-y-2 border-t border-slate-200 pt-3 dark:border-slate-700">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">New Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-amber-500 dark:border-slate-600 dark:bg-[#0d1628] dark:text-white"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Resolution Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="What did you do to resolve it?"
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500 dark:border-slate-600 dark:bg-[#0d1628] dark:text-white dark:placeholder-slate-500"
              />
            </div>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="w-full rounded-lg bg-amber-600 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
            >
              {isUpdating ? "Saving..." : "Save Update"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TechnicianDashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    try {
      const data = await ticketService.getAssignedTickets();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (ticketId, status, resolutionNotes) => {
    setUpdatingId(ticketId);
    try {
      const updated = await ticketService.updateStatus(ticketId, status, resolutionNotes);
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filterStatus === "ALL"
    ? tickets
    : tickets.filter((t) => t.status === filterStatus);

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "OPEN").length,
    inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter((t) => ["RESOLVED", "CLOSED"].includes(t.status)).length,
  };

  return (
    <AppLayout title="Technician Dashboard">
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Assigned", value: stats.total, color: "text-slate-900 dark:text-white" },
            { label: "Open", value: stats.open, color: "text-blue-600 dark:text-blue-400" },
            { label: "In Progress", value: stats.inProgress, color: "text-amber-600 dark:text-amber-400" },
            { label: "Resolved", value: stats.resolved, color: "text-emerald-600 dark:text-emerald-400" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-cyan-300/20 dark:bg-[#111a2d]/90"
            >
              <p className="text-xs font-medium text-slate-400">{label}</p>
              <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Filter + header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Assigned Tickets
          </h2>
          <div className="flex flex-wrap gap-2">
            {["ALL", ...ALL_STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
                  filterStatus === s
                    ? "bg-cyan-600 text-white dark:bg-cyan-500"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Ticket grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No tickets assigned</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((t) => (
              <TicketKanbanCard
                key={t.id}
                ticket={t}
                onStatusChange={handleStatusChange}
                isUpdating={updatingId === t.id}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
