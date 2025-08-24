package com.diplomski.auth.controller;

import com.diplomski.util.entity.TaskEntity;
import com.diplomski.util.service.TaskService;
import com.diplomski.util.entity.RoleEntity;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/task/tasks")
    public ResponseEntity<List<TaskEntity>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @PostMapping("/manager/task/create")
    public ResponseEntity<?> createTask(@RequestBody TaskEntity task) {
        try {
            taskService.createTask(task);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/manager/task/update")
    public ResponseEntity<?> updateTask(@RequestBody TaskEntity task) {
        try {
            taskService.updateTask(task);
            return ResponseEntity.status(HttpStatus.FOUND).build();
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (InvocationTargetException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/manager/task/delete/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable(name = "id") String id) {
       try {
           taskService.deleteTask(id);
           return ResponseEntity.status(HttpStatus.FOUND).build();
       } catch (ChangeSetPersister.NotFoundException e) {
           return ResponseEntity.notFound().build();
       }
    }
}
