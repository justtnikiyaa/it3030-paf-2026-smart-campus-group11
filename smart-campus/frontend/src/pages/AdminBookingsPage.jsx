import { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle, XCircle, Users, FileText, MessageSquare } from "lucide-react";
import { bookingService } from "../services/bookingService";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const reason = window.prompt("Enter a reason for approval (optional):");
    if (reason === null) return; // user cancelled
    try {
      await bookingService.approveBooking(id, reason || null);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter a reason for rejection:");
    if (reason === null) return; // user cancelled
    try {
      await bookingService.rejectBooking(id, reason || null);
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

  return (
    <AppLayout title="Manage Bookings">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Resource Bookings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View and manage all facility reservation requests.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full pt-8 text-center text-slate-500">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="col-span-full pt-8 text-center text-slate-500">No bookings exist in the system.</div>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id} className="border-slate-200 bg-white/60 backdrop-blur dark:border-cyan-300/10 dark:bg-[#111b31]/60">
                <CardContent className="p-4 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 truncate pr-2">{booking.title}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">User ID: {booking.ownerUserId}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="space-y-2 mt-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{booking.resource}</span>
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
                  
                  {booking.status === 'PENDING' && (
                    <div className="mt-5 border-t border-slate-200/60 dark:border-cyan-300/10 pt-3 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                        onClick={() => handleApprove(booking.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" /> Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                        onClick={() => handleReject(booking.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1.5" /> Reject
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
