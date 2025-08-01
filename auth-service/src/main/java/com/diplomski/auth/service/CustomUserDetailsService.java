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
                .orElseThrow(() -> new UsernameNotFoundException("User not found" + username));
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public void createUser(UserEntity user) throws BadRequestException {
        if (userRepository.findByUsername(user.getUsername()).isEmpty()) {
            userRepository.save(user);
        } else {
            throw new BadRequestException("Task already exists");
        }
    }

    public void updateUser(UserEntity user) throws ChangeSetPersister.NotFoundException {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            userRepository.save(user);
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    public void deleteUser(String username) throws ChangeSetPersister.NotFoundException {
        Optional<UserEntity> task = userRepository.findByUsername(username);
        if (task.isPresent()) {
            userRepository.delete(task.get());
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
