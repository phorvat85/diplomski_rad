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
        if (task.getId() == null) {
            taskRepository.save(task);
            //TODO() Create method in TaskRepository that will fetch task with biggest id so we don't need to fetch all tasks every time.
            TaskEntity createdTask = taskRepository.findAll().getLast();
            createdTask.setTaskKey(KEY_PREFIX + createdTask.getId());
            taskRepository.save(createdTask);
        } else {
            throw new BadRequestException("Task already exists");
        }
    }

    public void updateTask(TaskEntity task) throws ChangeSetPersister.NotFoundException {
        if (taskRepository.findById(String.valueOf(task.getId())).isPresent()) {
            taskRepository.save(task);
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    public void deleteTask(String id) throws ChangeSetPersister.NotFoundException {
        Optional<TaskEntity> task = taskRepository.findById(id);
        if (task.isPresent()) {
            taskRepository.delete(task.get());
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
