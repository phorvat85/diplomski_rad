package com.diplomski.auth.service;

import com.diplomski.auth.entity.TaskEntity;
import com.diplomski.auth.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private static final String KEY_PREFIX = "KFK-";
    private final TaskRepository taskRepository;

    public List<TaskEntity> getAllTasks() {
        return taskRepository.findAll();
    }

    public void createTask(TaskEntity task) throws BadRequestException {
        if (taskRepository.findByKey(task.getKey()).isEmpty()) {
            task.setKey(KEY_PREFIX + task.getKey());
            taskRepository.save(task);
        } else {
            throw new BadRequestException("Task already exists");
        }
    }

    public void updateTask(TaskEntity task) throws ChangeSetPersister.NotFoundException {
        if (taskRepository.findByKey(task.getKey()).isPresent()) {
            taskRepository.save(task);
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    public void deleteTask(String key) throws ChangeSetPersister.NotFoundException {
        Optional<TaskEntity> task = taskRepository.findByKey(key);
        if (task.isPresent()) {
            taskRepository.delete(task.get());
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
