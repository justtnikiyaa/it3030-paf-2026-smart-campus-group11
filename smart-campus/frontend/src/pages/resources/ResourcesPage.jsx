import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, MapPin, Users, Filter, LayoutGrid } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import resourceService from "../../services/resourceService";

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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-blue-600" />
            Facilities & Assets
          </h1>
          <p className="mt-2 text-sm text-gray-500">
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
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center text-gray-400">
          <Filter className="w-5 h-5 mr-3" />
          <span className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Filters</span>
        </div>
        
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Lab</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Search location..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Users className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="number"
              name="minCapacity"
              value={filters.minCapacity}
              onChange={handleFilterChange}
              placeholder="Min Capacity"
              min="1"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 border-dashed">
          <LayoutGrid className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No resources found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              onClick={() => navigate(`/resources/${resource.id}`)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4 gap-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {resource.name}
                  </h3>
                  {getStatusBadge(resource.status)}
                </div>
                
                <div className="mt-auto space-y-3">
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <span className="font-medium text-indigo-600 mr-2">{resource.type.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="truncate">{resource.location}</span>
                  </div>
                  
                  {resource.capacity && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
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
  );
}
