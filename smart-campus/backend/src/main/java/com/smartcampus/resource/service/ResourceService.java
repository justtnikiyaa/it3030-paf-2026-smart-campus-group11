package com.smartcampus.resource.service;

import com.smartcampus.resource.dto.ResourceRequestDTO;
import com.smartcampus.resource.dto.ResourceResponseDTO;
import com.smartcampus.resource.model.enums.ResourceStatus;
import com.smartcampus.resource.model.enums.ResourceType;

import java.util.List;

public interface ResourceService {

    /**
     * Retrieves all resources based on optional filters.
     *
     * @param type        Optional filter by resource type.
     * @param location    Optional filter by location.
     * @param minCapacity Optional filter by minimum capacity.
     * @return A list of ResourceResponseDTO objects.
     */
    List<ResourceResponseDTO> getAllResources(ResourceType type, String location, Integer minCapacity);

    /**
     * Retrieves a single resource by its ID.
     *
     * @param id The ID of the resource.
     * @return The found ResourceResponseDTO.
     */
    ResourceResponseDTO getResourceById(Long id);

    /**
     * Creates a new resource.
     *
     * @param requestDTO The resource data.
     * @return The created ResourceResponseDTO.
     */
    ResourceResponseDTO createResource(ResourceRequestDTO requestDTO);

    /**
     * Updates an existing resource.
     *
     * @param id         The ID of the resource to update.
     * @param requestDTO The updated resource data.
     * @return The updated ResourceResponseDTO.
     */
    ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO);

    /**
     * Deletes a resource by its ID.
     *
     * @param id The ID of the resource to delete.
     */
    void deleteResource(Long id);

    /**
     * Updates the status of an existing resource.
     *
     * @param id     The ID of the resource.
     * @param status The new status to set.
     * @return The updated ResourceResponseDTO.
     */
    ResourceResponseDTO updateResourceStatus(Long id, ResourceStatus status);
}
