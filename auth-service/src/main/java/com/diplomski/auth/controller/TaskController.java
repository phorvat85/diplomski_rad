package com.diplomski.auth.controller;

import com.diplomski.auth.entity.TaskEntity;
import com.diplomski.auth.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/task/tasks")
    public ResponseEntity<List<TaskEntity>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @PostMapping("/task/save")
    public ResponseEntity<?> createTask(@RequestBody TaskEntity task) {
        try {
            taskService.createTask(task);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    @PutMapping("/task/update")
    public ResponseEntity<?> updateTask(@RequestBody TaskEntity task) {
        try {
            taskService.updateTask(task);
            return ResponseEntity.status(HttpStatus.FOUND).build();
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/task/delete")
    public ResponseEntity<?> deleteTask(@RequestParam String key) {
       try {
           taskService.deleteTask(key);
           return ResponseEntity.status(HttpStatus.FOUND).build();
       } catch (ChangeSetPersister.NotFoundException e) {
           return ResponseEntity.notFound().build();
       }
    }
}
