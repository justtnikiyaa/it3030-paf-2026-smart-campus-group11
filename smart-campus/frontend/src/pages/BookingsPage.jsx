import { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PlusCircle, Calendar as CalendarIcon, Clock, XCircle, MapPin, Users, FileText, MessageSquare } from "lucide-react";
import { bookingService } from "../services/bookingService";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    resource: "",
    purpose: "",
    expectedAttendees: "",
    startTime: "",
    endTime: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  // Real-time validation for immediate user feedback
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (start >= end) {
        setError("Validation error: End Time cannot be before or equal to Start Time.");
        return;
      }
    }
    
    if (formData.startTime) {
      const start = new Date(formData.startTime);
      if (start.getFullYear() > 2099) {
        setError("Validation error: Unrealistic year entered.");
        return;
      }
      if (start < new Date()) {
        setError("Validation error: Start time cannot be in the past.");
        return;
      }
    }
    
    // Clear error if all real-time checks pass
    setError("");
  }, [formData.startTime, formData.endTime]);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.resource || !formData.purpose || !formData.startTime || !formData.endTime) {
      setError("Validation failed: All required fields must be filled.");
      return;
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError("Validation failed: Invalid date or time provided.");
      return;
    }

    if (start.getFullYear() > 2099 || end.getFullYear() > 2099) {
      setError("Validation failed: Unrealistic year entered. Must be before 2100.");
      return;
    }

    if (start < new Date()) {
      setError("Validation failed: Start time cannot be in the past.");
      return;
    }

    if (start >= end) {
      setError("Validation failed: End time must be later than Start time.");
      return;
    }

    try {
      // API expects LocalDateTime, HTML date picker gives e.g., '2023-11-20T10:30'
      await bookingService.createBooking({
        title: formData.title,
        resource: formData.resource,
        purpose: formData.purpose,
        expectedAttendees: formData.expectedAttendees ? parseInt(formData.expectedAttendees) : null,
        startTime: formData.startTime,
        endTime: formData.endTime
      });
      setShowForm(false);
      setFormData({ title: "", resource: "", purpose: "", expectedAttendees: "", startTime: "", endTime: "" });
      fetchBookings();
    } catch (err) {
      if (err.response?.data?.errors) {
        const fieldErrors = Object.values(err.response.data.errors).join(". ");
        setError(`Validation failed: ${fieldErrors}`);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create booking. There might be a conflict with another booking.");
      }
    }
  };

  const handleCancel = async (id) => {
    try {
      await bookingService.cancelBooking(id);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
      APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
      REJECTED: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200",
      CANCELLED: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200"
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getCurrentDatetimeString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  };

  return (
    <AppLayout title="My Bookings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Resource Bookings</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your reservations for campus facilities.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close Form' : <><PlusCircle className="mr-2 h-4 w-4" /> New Booking</>}
          </Button>
        </div>

        {showForm && (
          <Card className="border-slate-200/80 bg-white/90 backdrop-blur-sm dark:border-cyan-300/20 dark:bg-[#111a2d]/90 shadow-lg">
            <CardHeader>
              <CardTitle>Request a Resource</CardTitle>
              <CardDescription>Fill in the details below. Conflict checks will run automatically.</CardDescription>
            </CardHeader>
            <CardContent>
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg text-sm font-medium">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Title / Purpose</label>
                    <input 
                      type="text" 
                      name="title" 
                      required
                      value={formData.title} 
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-[#0b1221] dark:text-slate-100" 
                      placeholder="e.g. Group Study Session" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Resource</label>
                    <input 
                      type="text" 
                      name="resource" 
                      required
                      value={formData.resource} 
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-[#0b1221] dark:text-slate-100" 
                      placeholder="e.g. Library Room 2A" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Time</label>
                    <input 
                      type="datetime-local" 
                      name="startTime" 
                      required
                      min={getCurrentDatetimeString()}
                      max="2099-12-31T23:59"
                      value={formData.startTime} 
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-[#0b1221] dark:text-slate-100" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">End Time</label>
                    <input 
                      type="datetime-local" 
                      name="endTime" 
                      required
                      min={formData.startTime || getCurrentDatetimeString()}
                      max="2099-12-31T23:59"
                      value={formData.endTime} 
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-[#0b1221] dark:text-slate-100" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Purpose</label>
                    <input 
                      type="text" 
                      name="purpose" 
                      required
                      value={formData.purpose} 
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-[#0b1221] dark:text-slate-100" 
                      placeholder="e.g. Database lab session for Year 2" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expected Attendees</label>
                    <input 
                      type="number" 
                      name="expectedAttendees" 
                      min="1"
                      value={formData.expectedAttendees} 
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-[#0b1221] dark:text-slate-100" 
                      placeholder="e.g. 30" 
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={!!error || !formData.title || !formData.resource || !formData.purpose || !formData.startTime || !formData.endTime}>
                    Submit Request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full pt-8 text-center text-slate-500">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="col-span-full pt-8 text-center text-slate-500">No bookings found. Create one to get started!</div>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id} className="border-slate-200 bg-white/60 backdrop-blur dark:border-cyan-300/10 dark:bg-[#111b31]/60">
                <CardContent className="p-4 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 truncate pr-2">{booking.title}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="space-y-2 mt-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>{booking.resource}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-slate-400" />
                        <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>
                          {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {booking.purpose && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-violet-500" />
                          <span>{booking.purpose}</span>
                        </div>
                      )}
                      {booking.expectedAttendees && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-teal-500" />
                          <span>{booking.expectedAttendees} attendees</span>
                        </div>
                      )}
                    </div>
                    {booking.adminReason && (
                      <div className="mt-3 p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1 mb-0.5">
                          <MessageSquare className="w-3 h-3" />
                          <span className="font-semibold">Admin Reason:</span>
                        </div>
                        {booking.adminReason}
                      </div>
                    )}
                  </div>
                  
                  {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                    <div className="mt-5 border-t border-slate-200/60 dark:border-cyan-300/10 pt-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                        onClick={() => handleCancel(booking.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Cancel Booking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
