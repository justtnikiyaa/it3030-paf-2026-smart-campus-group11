import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import ticketService from "../services/ticketService";

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

function TicketCard({ ticket }) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className="group cursor-pointer rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.3)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-10px_rgba(15,23,42,0.4)] dark:border-cyan-300/20 dark:bg-[#111a2d]/90"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 font-semibold text-slate-900 dark:text-white">
          {ticket.subject}
        </h3>
        <div className="flex shrink-0 gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${PRIORITY_STYLES[ticket.priority]}`}>
            {ticket.priority}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[ticket.status]}`}>
            {ticket.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {ticket.resource && (
        <p className="mb-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {ticket.resource}
        </p>
      )}

      <p className="mb-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {ticket.category}
        </span>
        <span className="text-[11px] text-slate-400">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>

      {ticket.assignedTechnicianName && (
        <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
          Assigned to: <span className="font-medium text-slate-600 dark:text-slate-400">{ticket.assignedTechnicianName}</span>
        </p>
      )}
    </article>
  );
}

export default function TicketsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        const data = user?.role === "ADMIN"
          ? await ticketService.getAllTickets()
          : await ticketService.getMyTickets();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const filtered = filterStatus === "ALL"
    ? tickets
    : tickets.filter((t) => t.status === filterStatus);

  return (
    <AppLayout title="Incident Tickets">
      <div className="space-y-4">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {user?.role === "ADMIN" ? "All Tickets" : "My Tickets"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filtered.length} ticket{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => navigate("/tickets/new")}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Ticket
          </button>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
                filterStatus === s
                  ? "bg-cyan-600 text-white dark:bg-cyan-500"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No tickets found</p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              {filterStatus !== "ALL" ? "Try a different filter" : "Submit your first incident report"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((t) => <TicketCard key={t.id} ticket={t} />)}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
