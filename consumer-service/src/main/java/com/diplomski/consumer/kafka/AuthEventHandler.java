package com.diplomski.consumer.kafka;

import com.diplomski.util.RecordType;
import com.diplomski.util.entity.UserEntity;
import com.diplomski.util.service.CustomUserDetailsService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;

@Log4j2
@Component
@AllArgsConstructor
public class AuthEventHandler {

    private final CustomUserDetailsService userDetailsService;

    public void checkEvent(ConsumerRecord<String, UserConsumerRecord> record) {
        switch (record.value().getRecordType()) {
            case RecordType.WRONG_CREDENTIALS -> badCredentialsHandler(record);
            case RecordType.SUCCESSFUL_LOGIN -> successfulLoginHandler(record);
        }
    }

    private void badCredentialsHandler(ConsumerRecord<String, UserConsumerRecord> record) {
        try {
            UserEntity failedUser = userDetailsService.getUserById(record.value().getUserId());
            checkForBlock(failedUser);
        } catch (ChangeSetPersister.NotFoundException | InvocationTargetException | IllegalAccessException e) {
            log.error("User not found: {}", e.getMessage());
        }
    }

    private void successfulLoginHandler(ConsumerRecord<String, UserConsumerRecord> record) {
        try {
            UserEntity successfulUser = userDetailsService.getUserById(record.value().getUserId());
            checkForReset(successfulUser);
        } catch (ChangeSetPersister.NotFoundException | InvocationTargetException | IllegalAccessException e) {
            log.error("User not found: {}", e.getMessage());
        }
    }

    private void checkForBlock(UserEntity failedUser) throws ChangeSetPersister.NotFoundException, InvocationTargetException, IllegalAccessException {
        if (failedUser.getFailedLoginAttempts() >= 5) {
            failedUser.setEnabled(false);
            userDetailsService.updateUser(failedUser);
            log.info("User {} blocked", failedUser.getUsername());
        } else {
            failedUser.setFailedLoginAttempts(failedUser.getFailedLoginAttempts() + 1);
            userDetailsService.updateUser(failedUser);
            log.info("User {} has failed login attempt, failed login attempts incremented. {} ", failedUser.getUsername(), failedUser.getFailedLoginAttempts());
        }
    }

    private void checkForReset(UserEntity successfulUser) throws ChangeSetPersister.NotFoundException, InvocationTargetException, IllegalAccessException {
        if (successfulUser != null) {
            successfulUser.setFailedLoginAttempts(0);
            userDetailsService.updateUser(successfulUser);
            log.info("Successful login for user {} detected, resetting failed login attempts to {}. ", successfulUser.getUsername(), successfulUser.getFailedLoginAttempts());
        } else {
            log.error("User not found: {}", successfulUser.getUsername());
        }
    }
}

