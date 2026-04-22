import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, MapPin, Users, Filter, LayoutGrid } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import resourceService from "../../services/resourceService";
import AppLayout from "../../components/layout/AppLayout";

export default function ResourcesPage() {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    type: "",
    location: "",
    minCapacity: ""
  });

  const fetchResources = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await resourceService.getAllResources(filters);
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    if (status === "ACTIVE") {
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Active</span>;
    }
    return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-700 border border-rose-200">Out of Service</span>;
  };

  return (
    <AppLayout title="Facilities & Assets" titleIcon={LayoutGrid}>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-700 dark:text-slate-200 tracking-tight">
              Facilities & Assets
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Browse and manage campus resources, rooms, and equipment.
            </p>
          </div>
          
          {role === "ADMIN" && (
            <Link
              to="/admin/resources/new"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Resource
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#111c33] p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-cyan-300/20 mb-8 flex flex-col md:flex-row items-center gap-4 transition-colors">
          <div className="flex items-center text-slate-400 dark:text-slate-300">
            <Filter className="w-5 h-5 mr-3" />
            <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">Filters</span>
          </div>
          
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1e293b] text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-cyan-300/20 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
            >
              <option value="" className="dark:bg-[#111c33]">All Types</option>
              <option value="LECTURE_HALL" className="dark:bg-[#111c33]">Lecture Hall</option>
              <option value="LAB" className="dark:bg-[#111c33]">Lab</option>
              <option value="MEETING_ROOM" className="dark:bg-[#111c33]">Meeting Room</option>
              <option value="EQUIPMENT" className="dark:bg-[#111c33]">Equipment</option>
            </select>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search location..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#1e293b] text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-cyan-300/20 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Users className="w-4 h-4 absolute left-3 top-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="number"
                name="minCapacity"
                value={filters.minCapacity}
                onChange={handleFilterChange}
                placeholder="Min Capacity"
                min="1"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#1e293b] text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-cyan-300/20 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100 flex items-center">
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#111c33] rounded-2xl border border-slate-200 dark:border-cyan-300/20 border-dashed group transition-colors hover:border-slate-300 dark:hover:border-cyan-300/40">
            <LayoutGrid className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" />
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No resources found</h3>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Try adjusting your filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.id}
                onClick={() => navigate(`/resources/${resource.id}`)}
                className="group bg-white dark:bg-[#111c33] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 dark:border-cyan-300/20 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {resource.name}
                    </h3>
                    {getStatusBadge(resource.status)}
                  </div>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                      <span className="font-medium text-indigo-600 dark:text-indigo-400 mr-2">{resource.type.replace('_', ' ')}</span>
                    </div>

                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2 flex-shrink-0" />
                      <span className="truncate">{resource.location}</span>
                    </div>
                    
                    {resource.capacity && (
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Users className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2 flex-shrink-0" />
                        <span>Capacity: {resource.capacity}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
