package com.smartcampus.resource.service.impl;

import com.smartcampus.common.exception.ResourceNotFoundException;
import com.smartcampus.resource.dto.ResourceRequestDTO;
import com.smartcampus.resource.dto.ResourceResponseDTO;
import com.smartcampus.resource.model.Resource;
import com.smartcampus.resource.model.enums.ResourceStatus;
import com.smartcampus.resource.model.enums.ResourceType;
import com.smartcampus.resource.repository.ResourceRepository;
import com.smartcampus.resource.service.ResourceService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public List<ResourceResponseDTO> getAllResources(ResourceType type, String location, Integer minCapacity) {
        Specification<Resource> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (location != null && !location.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }
            if (minCapacity != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("capacity"), minCapacity));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return resourceRepository.findAll(spec).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceResponseDTO getResourceById(Long id) {
        Resource resource = findResourceEntityById(id);
        return mapToDTO(resource);
    }

    @Override
    public ResourceResponseDTO createResource(ResourceRequestDTO requestDTO) {
        Resource resource = Resource.builder()
                .name(requestDTO.getName())
                .type(requestDTO.getType())
                .capacity(requestDTO.getCapacity())
                .location(requestDTO.getLocation())
                .availabilityWindows(requestDTO.getAvailabilityWindows())
                .status(requestDTO.getStatus() != null ? requestDTO.getStatus() : ResourceStatus.ACTIVE)
                .description(requestDTO.getDescription())
                .build();

        Resource savedResource = resourceRepository.save(resource);
        return mapToDTO(savedResource);
    }

    @Override
    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO) {
        Resource resource = findResourceEntityById(id);

        resource.setName(requestDTO.getName());
        resource.setType(requestDTO.getType());
        resource.setCapacity(requestDTO.getCapacity());
        resource.setLocation(requestDTO.getLocation());
        resource.setAvailabilityWindows(requestDTO.getAvailabilityWindows());
        if (requestDTO.getStatus() != null) {
            resource.setStatus(requestDTO.getStatus());
        }
        resource.setDescription(requestDTO.getDescription());

        Resource updatedResource = resourceRepository.save(resource);
        return mapToDTO(updatedResource);
    }

    @Override
    public void deleteResource(Long id) {
        Resource resource = findResourceEntityById(id);
        resourceRepository.delete(resource);
    }

    @Override
    public ResourceResponseDTO updateResourceStatus(Long id, ResourceStatus status) {
        Resource resource = findResourceEntityById(id);
        resource.setStatus(status);
        Resource updatedResource = resourceRepository.save(resource);
        return mapToDTO(updatedResource);
    }

    private Resource findResourceEntityById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));
    }

    private ResourceResponseDTO mapToDTO(Resource resource) {
        return ResourceResponseDTO.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availabilityWindows(resource.getAvailabilityWindows())
                .status(resource.getStatus())
                .description(resource.getDescription())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}
