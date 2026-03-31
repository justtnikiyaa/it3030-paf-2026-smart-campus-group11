package com.smartcampus.user.repository;

import com.smartcampus.user.entity.Role;
import com.smartcampus.user.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
