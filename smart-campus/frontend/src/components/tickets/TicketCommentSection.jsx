import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ticketService from "../../services/ticketService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString();
}

function Avatar({ name, pictureUrl }) {
  if (pictureUrl) {
    return (
      <img
        src={pictureUrl}
        alt={name}
        className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
      />
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white">
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}

export default function TicketCommentSection({ ticketId, comments: initialComments, onRefresh }) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState(initialComments || []);
  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = async () => {
    if (!newMessage.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const added = await ticketService.addComment(ticketId, newMessage.trim());
      setComments((prev) => [...prev, added]);
      setNewMessage("");
      onRefresh?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (commentId) => {
    if (!editMessage.trim()) return;
    setIsSubmitting(true);
    try {
      const updated = await ticketService.editComment(ticketId, commentId, editMessage.trim());
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await ticketService.deleteComment(ticketId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Comments <span className="text-slate-400">({comments.length})</span>
      </h2>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Comment thread */}
      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-400 dark:text-slate-500">
            No comments yet. Be the first to add one.
          </p>
        )}

        {comments.map((comment) => {
          const isOwn = user?.id === comment.commenterUserId;
          const isEditing = editingId === comment.id;

          return (
            <div key={comment.id} className="flex gap-3">
              <Avatar name={comment.commenterName} pictureUrl={comment.commenterPictureUrl} />

              <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-[#0d1628]">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {comment.commenterName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {formatDate(comment.createdAt)}
                      {comment.updatedAt && " (edited)"}
                    </span>
                    {isOwn && !isEditing && (
                      <>
                        <button
                          onClick={() => { setEditingId(comment.id); setEditMessage(comment.message); }}
                          className="rounded px-1.5 py-0.5 text-[11px] font-medium text-cyan-600 transition hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/30"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="rounded px-1.5 py-0.5 text-[11px] font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-[#111a2d] dark:text-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(comment.id)}
                        disabled={isSubmitting}
                        className="rounded-lg bg-cyan-600 px-3 py-1 text-xs font-semibold text-white hover:bg-cyan-700 disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {comment.message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add comment */}
      <div className="flex gap-3 pt-2">
        {user?.pictureUrl ? (
          <img src={user.pictureUrl} alt="me" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white">
            {user?.fullName?.charAt(0) ?? "?"}
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={3}
            placeholder="Write a comment..."
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-[#0d1628] dark:text-white dark:placeholder-slate-500"
          />
          <button
            onClick={handleAdd}
            disabled={isSubmitting || !newMessage.trim()}
            className="self-end rounded-lg bg-cyan-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50 dark:bg-cyan-500 dark:hover:bg-cyan-600"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </section>
  );
}
