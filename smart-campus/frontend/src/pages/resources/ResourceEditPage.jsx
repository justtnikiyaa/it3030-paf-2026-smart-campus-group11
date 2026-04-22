import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResourceForm from "../../components/resources/ResourceForm";
import resourceService from "../../services/resourceService";

export default function ResourceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await resourceService.getResourceById(id);
        setInitialData(data);
      } catch (error) {
        alert("Failed to fetch resource: " + error.message);
        navigate("/resources");
      } finally {
        setIsFetching(false);
      }
    };
    fetchResource();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      await resourceService.updateResource(id, data);
      navigate(`/resources/${id}`);
    } catch (error) {
      alert("Failed to update resource: " + error.message);
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return <ResourceForm initialData={initialData} onSubmit={handleSubmit} isLoading={isLoading} mode="edit" />;
}
