package com.diplomski.auth.controller;

import com.diplomski.auth.entity.UserEntity;
import com.diplomski.auth.service.CustomUserDetailsService;
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
public class UserController {

    private final CustomUserDetailsService userService;

    @GetMapping("/user/users")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/user/create")
    public ResponseEntity<?> createUser(@RequestBody UserEntity user) {
        try {
            userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/user/update")
    public ResponseEntity<?> updateUser(@RequestBody UserEntity user) {
        try {
            userService.updateUser(user);
            return ResponseEntity.status(HttpStatus.FOUND).build();
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/user/delete")
    public ResponseEntity<?> deleteUser(@RequestParam String username) {
        try {
            userService.deleteUser(username);
            return ResponseEntity.status(HttpStatus.FOUND).build();
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
