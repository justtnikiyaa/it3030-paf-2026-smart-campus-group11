package com.smartcampus.resource.repository;

import com.smartcampus.resource.model.Resource;
import com.smartcampus.resource.model.enums.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long>, JpaSpecificationExecutor<Resource> {

    List<Resource> findByType(ResourceType type);

    List<Resource> findByLocation(String location);

    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);
}
