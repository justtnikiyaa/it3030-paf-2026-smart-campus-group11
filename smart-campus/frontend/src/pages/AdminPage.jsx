import React, { useState, useEffect } from 'react';
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BellRing, ShieldCheck, Users2, X, Wrench, Loader2, UserCog } from "lucide-react";
import notificationService from "../services/notificationService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // User management state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [roleUpdating, setRoleUpdating] = useState(null);
  const [roleFeedback, setRoleFeedback] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleAssignRole = async (userId, roleName) => {
    setRoleUpdating(userId);
    setRoleFeedback(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role?roleName=${roleName}`, {
        method: "PUT",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to assign role");
      setRoleFeedback({ userId, type: 'success', text: `${roleName} role assigned!` });
      fetchUsers();
    } catch (err) {
      setRoleFeedback({ userId, type: 'error', text: err.message });
    } finally {
      setRoleUpdating(null);
    }
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await notificationService.sendBroadcast(title, message);
      setFeedback({ type: 'success', text: 'Campus alert broadcasted successfully!' });
      setTitle('');
      setMessage('');
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (error) {
      setFeedback({ type: 'error', text: error.message || 'Failed to send alert.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300';
      case 'TECHNICIAN': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300';
    }
  };

  return (
    <AppLayout title="Admin">
      <div className="space-y-4">
        <Card className="border-slate-200/80 bg-white/90 backdrop-blur-sm dark:border-cyan-300/20 dark:bg-[#111a2d]/90">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Admin Controls</CardTitle>
            <CardDescription>
              Manage operations, send notifications, and monitor system-level updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/85 p-3 dark:border-cyan-300/15 dark:bg-[#0d1628]">
                <div className="mb-2 inline-flex rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                  <BellRing className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notification broadcast</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Send campus-wide alerts and notices.</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/85 p-3 dark:border-cyan-300/15 dark:bg-[#0d1628]">
                <div className="mb-2 inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                  <Users2 className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">User oversight</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Track user activity and role assignment health.</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/85 p-3 dark:border-cyan-300/15 dark:bg-[#0d1628]">
                <div className="mb-2 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Security status</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Keep role-based access and permissions clean.</p>
              </div>
            </div>

            <Button onClick={() => setIsModalOpen(true)}>Send Campus Alert</Button>
          </CardContent>
        </Card>

        {/* ── User Role Management ─────────────────────────────────────────── */}
        <Card className="border-slate-200/80 bg-white/90 backdrop-blur-sm dark:border-cyan-300/20 dark:bg-[#111a2d]/90">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-indigo-500" />
              <CardTitle className="text-xl">User Role Management</CardTitle>
            </div>
            <CardDescription>
              View all registered users and assign roles. Users must log in via Google first to appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : users.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No users registered yet. Users appear here after they sign in with Google.
              </p>
            ) : (
              <div className="space-y-2">
                {users.map((user) => {
                  const roles = Array.isArray(user.roles) ? user.roles : (user.roles ? Object.values(user.roles) : []);
                  const isTechnician = roles.includes('TECHNICIAN');
                  const isAdmin = roles.includes('ADMIN');

                  return (
                    <div
                      key={user.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 dark:border-cyan-300/15 dark:bg-[#0d1628]/60"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {user.pictureUrl ? (
                          <img src={user.pictureUrl} alt="" className="h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-700" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {user.fullName?.charAt(0) || '?'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user.fullName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Role badges */}
                        <div className="flex gap-1">
                          {roles.map((role) => (
                            <span key={role} className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getRoleBadgeClass(role)}`}>
                              {role}
                            </span>
                          ))}
                        </div>

                        {/* Action buttons */}
                        {!isTechnician && !isAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2.5 text-[11px] border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/20"
                            disabled={roleUpdating === user.id}
                            onClick={() => handleAssignRole(user.id, 'TECHNICIAN')}
                          >
                            {roleUpdating === user.id ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <Wrench className="h-3 w-3 mr-1" />
                            )}
                            Make Technician
                          </Button>
                        )}

                        {/* Feedback for this user */}
                        {roleFeedback?.userId === user.id && (
                          <span className={`text-[11px] font-medium ${roleFeedback.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {roleFeedback.text}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-[#0d1628] dark:border dark:border-cyan-300/20">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold dark:text-white">Send Campus Alert</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {feedback && (
              <div className={`mb-4 rounded p-3 text-sm ${feedback.type === 'success' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSendAlert} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium dark:text-slate-200">Alert Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Campus Closure"
                  className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium dark:text-slate-200">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your alert message here..."
                  rows={4}
                  className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" className="border-slate-300 dark:border-slate-600 dark:bg-transparent dark:text-white" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting || !title.trim() || !message.trim()} className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  {isSubmitting ? 'Sending...' : 'Send Alert'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
