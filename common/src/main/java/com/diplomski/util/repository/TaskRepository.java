package com.diplomski.util.repository;

import com.diplomski.util.entity.RoleEntity;
import com.diplomski.util.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, String> {
    Optional<TaskEntity> findByTaskKey(String taskKey);
}
