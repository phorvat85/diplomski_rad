package com.diplomski.auth.repository;

import com.diplomski.auth.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, String> {
    Optional<TaskEntity> findByTaskKey(String taskKey);
}
