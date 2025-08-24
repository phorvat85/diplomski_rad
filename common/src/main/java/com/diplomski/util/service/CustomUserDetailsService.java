package com.diplomski.util.service;

import com.diplomski.util.DTOs.BasicUserUpdateDTO;
import com.diplomski.util.DTOs.PasswordResetDTO;
import com.diplomski.util.DTOs.UserMeDTO;
import com.diplomski.util.entity.UserEntity;
import com.diplomski.util.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.beanutils.BeanUtilsBean;
import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final BeanUtilsBean beanUtilsBean;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserEntity loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public UserEntity getUserById(Long id) throws ChangeSetPersister.NotFoundException {
        return userRepository.findById(String.valueOf(id))
                .orElseThrow(ChangeSetPersister.NotFoundException::new);
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public void createUser(UserEntity user) throws BadRequestException {
        if (user.getId() == null) {
            userRepository.save(user);
        } else {
            throw new BadRequestException("User already exists");
        }
    }

    public void updateUser(UserEntity user) throws ChangeSetPersister.NotFoundException, InvocationTargetException, IllegalAccessException {
        Optional<UserEntity> savedUser = userRepository.findById(String.valueOf(user.getId()));
        if (savedUser.isPresent()) {
            log.info("User received: {}", user);
            updateUserFields(savedUser.get(), user);
            log.info("Successfully saved user {}", userRepository.save(savedUser.get()));
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

    public void updatePassword(PasswordResetDTO passwordResetDTO) throws BadRequestException {
        Optional<UserEntity> savedUser = userRepository.findById(String.valueOf(passwordResetDTO.getId()));
        if (savedUser.isPresent() && passwordEncoder.matches(passwordResetDTO.getOldPassword(), savedUser.get().getPassword())) {
            savedUser.get().setPassword(passwordEncoder.encode(passwordResetDTO.getNewPassword()));
            userRepository.save(savedUser.get());
            log.info("Successfully saved new password {}", savedUser.get());
        } else {
            log.error("Password reset failed for user {}", savedUser.get());
            throw new BadRequestException("User does not exist or old password is wrong");
        }
    }

    public void updateUserBasics(BasicUserUpdateDTO basicUserUpdateDTO) throws ChangeSetPersister.NotFoundException {
        Optional<UserEntity> savedUser = userRepository.findById(String.valueOf(basicUserUpdateDTO.getId()));
        if (savedUser.isPresent()) {
            savedUser.get().setUsername(basicUserUpdateDTO.getUsername());
            savedUser.get().setEmail(basicUserUpdateDTO.getEmail());
            userRepository.save(savedUser.get());
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    public UserMeDTO getCurrentUserMeDTO(UserEntity userEntity) throws InvocationTargetException, IllegalAccessException {
        UserMeDTO userMeDTO = new UserMeDTO();
        beanUtilsBean.copyProperties(userMeDTO, userEntity);
        log.info("Current user UserMeDTO: {} mapped from UserEntity {}", userMeDTO, userEntity);
        return userMeDTO;
    }

    private void updateUserFields(UserEntity savedUser, UserEntity user) {
        savedUser.setUsername(user.getUsername());
        savedUser.setEmail(user.getEmail());
        savedUser.setRole(user.getRole());
        savedUser.setEnabled(user.isEnabled());
        savedUser.setAccountNonExpired(user.isAccountNonExpired());
        savedUser.setCredentialsNonExpired(user.isCredentialsNonExpired());
        savedUser.setAccountNonLocked(user.isAccountNonLocked());
        savedUser.setFailedLoginAttempts(user.getFailedLoginAttempts());
    }
}
