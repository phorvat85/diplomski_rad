package com.diplomski.auth.service;

import com.diplomski.auth.entity.UserEntity;
import com.diplomski.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserEntity loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public void createUser(UserEntity user) throws BadRequestException {
        if (userRepository.findById(String.valueOf(user.getId())).isEmpty()) {
            userRepository.save(user);
        } else {
            throw new BadRequestException("User already exists");
        }
    }

    public void updateUser(UserEntity user) throws ChangeSetPersister.NotFoundException {
        if (userRepository.findById(String.valueOf(user.getId())).isPresent()) {
            userRepository.save(user);
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    public void deleteUser(String id) throws ChangeSetPersister.NotFoundException {
        Optional<UserEntity> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.delete(user.get());
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
