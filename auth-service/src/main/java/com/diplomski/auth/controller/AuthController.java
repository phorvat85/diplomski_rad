package com.diplomski.auth.controller;

import com.diplomski.auth.entity.UserEntity;
import com.diplomski.auth.security.DTOs.AuthRequestDTO;
import com.diplomski.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.errors.AuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserEntity user){
        return ResponseEntity.ok("User registered:" + authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO authRequest) {
        try {
            return ResponseEntity.ok(authService.login(authRequest));
        } catch (AuthenticationException e) {
            log.error("Invalid credentials.", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
        }
    }
}
