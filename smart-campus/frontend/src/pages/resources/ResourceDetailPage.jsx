import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Calendar, Info, Edit, Trash2, LayoutGrid, Clock, AlertTriangle } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import resourceService from "../../services/resourceService";
import AppLayout from "../../components/layout/AppLayout";

export default function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusToggling, setIsStatusToggling] = useState(false);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    setIsLoading(true);
    try {
      const data = await resourceService.getResourceById(id);
      setResource(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this resource? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      await resourceService.deleteResource(id);
      navigate("/resources", { replace: true });
    } catch (err) {
      alert("Failed to delete: " + err.message);
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsStatusToggling(true);
    try {
      const newStatus = resource.status === "ACTIVE" ? "OUT_OF_SERVICE" : "ACTIVE";
      const updated = await resourceService.updateResourceStatus(id, newStatus);
      setResource(updated);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setIsStatusToggling(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="Facilities & Assets" titleIcon={LayoutGrid}>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (error || !resource) {
    return (
      <AppLayout title="Facilities & Assets" titleIcon={LayoutGrid}>
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 flex flex-col items-center text-center">
            <AlertTriangle className="w-12 h-12 mb-4 text-red-400" />
            <h2 className="text-xl font-bold mb-2">Resource Not Found</h2>
            <p className="mb-6">{error || "The resource you are looking for does not exist or has been removed."}</p>
            <button 
              onClick={() => navigate("/resources")}
              className="px-6 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors"
            >
              Back to Resources
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Facilities & Assets" titleIcon={LayoutGrid}>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Actions */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => navigate("/resources")} 
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-white dark:bg-[#111c33] px-4 py-2 rounded-full border border-slate-200 dark:border-cyan-300/20 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Resources
          </button>

          {role === "ADMIN" && (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleStatus}
                disabled={isStatusToggling}
                className={`px-4 py-2 text-sm font-medium rounded-lg border flex items-center transition-all ${
                  resource.status === 'ACTIVE' 
                    ? 'border-orange-200 text-orange-700 hover:bg-orange-50 bg-white dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50 dark:hover:bg-orange-900/40'
                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 dark:hover:bg-emerald-900/40'
                }`}
              >
                {resource.status === 'ACTIVE' ? 'Set Out of Service' : 'Set Active'}
              </button>
              <Link
                to={`/admin/resources/${id}/edit`}
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg flex items-center transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-[#111c33] rounded-3xl shadow-lg border border-slate-100 dark:border-cyan-300/20 overflow-hidden relative">
          <div className={`absolute top-0 w-full h-2 ${resource.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          
          <div className="p-8 sm:p-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-10 border-b border-slate-100 dark:border-cyan-300/20 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50">
                    {resource.type.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${
                    resource.status === "ACTIVE" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50" 
                      : "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50"
                  }`}>
                    {resource.status.replace('_', ' ')}
                  </span>
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-200 tracking-tight leading-tight mb-2">
                  {resource.name}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Key Details
                  </h3>
                  <dl className="grid grid-cols-1 gap-y-4">
                    <div className="flex items-start">
                      <dt className="w-8 flex-shrink-0 flex items-center justify-center pt-0.5">
                        <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      </dt>
                      <dd className="text-lg font-medium text-slate-900 dark:text-slate-300">{resource.location}</dd>
                    </div>
                    
                    {resource.capacity && (
                      <div className="flex items-start">
                        <dt className="w-8 flex-shrink-0 flex items-center justify-center pt-0.5">
                          <Users className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </dt>
                        <dd className="text-lg font-medium text-slate-900 dark:text-slate-300">{resource.capacity} People Capacity</dd>
                      </div>
                    )}

                    {resource.availabilityWindows && (
                      <div className="flex items-start">
                        <dt className="w-8 flex-shrink-0 flex items-center justify-center pt-0.5">
                          <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </dt>
                        <dd className="text-lg font-medium text-slate-900 dark:text-slate-300">{resource.availabilityWindows}</dd>
                      </div>
                    )}
                  </dl>
                </div>

              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  About
                </h3>
                <div className="prose prose-blue text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#152340] rounded-2xl p-6 border border-slate-100 dark:border-cyan-300/20">
                  {resource.description ? (
                    <p className="whitespace-pre-wrap m-0 leading-relaxed">{resource.description}</p>
                  ) : (
                    <p className="m-0 italic text-slate-400 dark:text-slate-500">No description provided for this resource.</p>
                  )}
                </div>
                
                <div className="mt-8 text-xs text-slate-400 dark:text-slate-500 space-y-1 pl-1">
                  <p>Created: {new Date(resource.createdAt).toLocaleString()}</p>
                  {resource.updatedAt && <p>Last updated: {new Date(resource.updatedAt).toLocaleString()}</p>}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
