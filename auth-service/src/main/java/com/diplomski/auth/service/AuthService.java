package com.diplomski.auth.service;

import com.diplomski.auth.entity.RoleEntity;
import com.diplomski.auth.entity.UserEntity;
import com.diplomski.auth.repository.RoleRepository;
import com.diplomski.auth.repository.UserRepository;
import com.diplomski.auth.security.DTOs.AuthRequestDTO;
import com.diplomski.auth.security.DTOs.AuthResponseDTO;
import com.diplomski.auth.security.JWT.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.errors.AuthenticationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService customUserDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public UserEntity register(UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(roleRepository.findById(3L).get());
        userRepository.save(user);
        log.info("Saved user after successful registration: {}", user);
        return user;
    }

    public AuthResponseDTO login(AuthRequestDTO authRequest) throws AuthenticationException {
        log.info("Received login request for user: {}", authRequest);
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        return new AuthResponseDTO(generateJWTForUser(authRequest));
    }

    public String generateJWTForUser(AuthRequestDTO authRequest) {
        UserEntity user = customUserDetailsService.loadUserByUsername(authRequest.getUsername());
        return jwtUtil.generateToken(user);
    }
}
