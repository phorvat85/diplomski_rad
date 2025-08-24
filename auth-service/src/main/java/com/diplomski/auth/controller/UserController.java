package com.diplomski.auth.controller;

import com.diplomski.util.DTOs.BasicUserUpdateDTO;
import com.diplomski.util.DTOs.PasswordResetDTO;
import com.diplomski.util.DTOs.UserMeDTO;
import com.diplomski.util.entity.UserEntity;
import com.diplomski.util.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class UserController {

    private final CustomUserDetailsService userService;

    @GetMapping("/worker/user/users")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/admin/user/create")
    public ResponseEntity<?> createUser(@RequestBody UserEntity user) {
        try {
            userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/admin/user/update")
    public ResponseEntity<?> updateUser(@RequestBody UserEntity user) {
        try {
            userService.updateUser(user);
            return ResponseEntity.status(HttpStatus.FOUND).build();
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (InvocationTargetException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/admin/user/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable(name = "id") String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.status(HttpStatus.FOUND).build();
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/worker/user/update/password")
    public ResponseEntity<?> updateUserPassword(@RequestBody PasswordResetDTO passwordResetDTO) {
        try {
            userService.updatePassword(passwordResetDTO);
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/worker/user/update/basic")
    public ResponseEntity<?> updateUserBasics(@RequestBody BasicUserUpdateDTO basicUserUpdateDTO) {
        try {
            userService.updateUserBasics(basicUserUpdateDTO);
            return ResponseEntity.status(HttpStatus.FOUND).build();
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/worker/user/me")
    public ResponseEntity<UserMeDTO> getCurrentUser(@AuthenticationPrincipal UserEntity userEntity) {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(userService.getCurrentUserMeDTO(userEntity));
        } catch (InvocationTargetException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }
}
