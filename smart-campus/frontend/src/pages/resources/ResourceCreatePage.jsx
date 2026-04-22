import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import ResourceForm from "../../components/resources/ResourceForm";
import resourceService from "../../services/resourceService";
import AppLayout from "../../components/layout/AppLayout";

export default function ResourceCreatePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const created = await resourceService.createResource(data);
      navigate(`/resources/${created.id}`);
    } catch (error) {
      alert("Failed to create resource: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Facilities & Assets" titleIcon={LayoutGrid}>
      <ResourceForm onSubmit={handleSubmit} isLoading={isLoading} mode="add" />
    </AppLayout>
  );
}
