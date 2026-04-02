import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Button } from "../components/ui/button";
import notificationPreferenceService from "../services/notificationPreferenceService";

const initialForm = {
  bookingNotificationsEnabled: true,
  ticketNotificationsEnabled: true,
  commentNotificationsEnabled: true,
  emailNotificationsEnabled: false
};

export default function NotificationSettingsPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await notificationPreferenceService.getMyPreferences();
        if (!active) return;
        setForm({
          bookingNotificationsEnabled: Boolean(data.bookingNotificationsEnabled),
          ticketNotificationsEnabled: Boolean(data.ticketNotificationsEnabled),
          commentNotificationsEnabled: Boolean(data.commentNotificationsEnabled),
          emailNotificationsEnabled: Boolean(data.emailNotificationsEnabled)
        });
      } catch (err) {
        if (active) setError(err.message || "Failed to load preferences.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const onToggle = (key) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
    setSuccess("");
  };

  const onSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await notificationPreferenceService.updateMyPreferences(form);
      setForm({
        bookingNotificationsEnabled: Boolean(updated.bookingNotificationsEnabled),
        ticketNotificationsEnabled: Boolean(updated.ticketNotificationsEnabled),
        commentNotificationsEnabled: Boolean(updated.commentNotificationsEnabled),
        emailNotificationsEnabled: Boolean(updated.emailNotificationsEnabled)
      });
      setSuccess("Preferences saved successfully.");
    } catch (err) {
      setError(err.message || "Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  const options = [
    {
      key: "bookingNotificationsEnabled",
      title: "Booking notifications",
      description: "Receive notifications when booking requests are approved or rejected."
    },
    {
      key: "ticketNotificationsEnabled",
      title: "Ticket notifications",
      description: "Receive notifications when your ticket status changes."
    },
    {
      key: "commentNotificationsEnabled",
      title: "Comment notifications",
      description: "Receive notifications when new comments are added to your tickets."
    },
    {
      key: "emailNotificationsEnabled",
      title: "Email notifications",
      description: "Also receive selected notifications by email (optional)."
    }
  ];

  return (
    <AppLayout title="Notification Settings">
      <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] dark:border-cyan-300/20 dark:bg-[#111a2d]/90 md:p-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Preferences</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Choose what notifications you want to receive.</p>

        {loading && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading preferences...</p>}
        {!loading && error && <p className="mt-4 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
        {!loading && success && <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-300">{success}</p>}

        {!loading && (
          <div className="mt-5 space-y-3">
            {options.map((option) => (
              <label
                key={option.key}
                className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-cyan-300/15 dark:bg-[#0f182d]"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{option.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{option.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={form[option.key]}
                  onChange={() => onToggle(option.key)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <Button onClick={onSave} disabled={loading || saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </section>
    </AppLayout>
  );
}
