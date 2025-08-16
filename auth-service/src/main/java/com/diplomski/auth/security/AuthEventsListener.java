package com.diplomski.auth.security;

import com.diplomski.auth.entity.UserEntity;
import com.diplomski.auth.kafka.KafkaProducer;
import com.diplomski.auth.kafka.UserProducerRecord;
import com.diplomski.auth.service.CustomUserDetailsService;
import com.diplomski.util.RecordType;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Log4j2
@Component
@RequiredArgsConstructor
public class AuthEventsListener {

    private final KafkaProducer kafkaProducer;
    private final CustomUserDetailsService customUserDetailsService;

    @EventListener
    public void badCredentialsListener(AuthenticationFailureBadCredentialsEvent event) {
        log.error("Invalid credentials, sending failed login event to Kafka.");
        kafkaProducer.sendMessage(generateProducerRecord(event.getAuthentication().getName()));
    }

    private UserProducerRecord generateProducerRecord(String username) {
        return new UserProducerRecord(customUserDetailsService
                .getAllUsers()
                .stream()
                .filter((user) -> Objects.equals(user.getUsername(), username))
                .map(UserEntity::getId)
                .findFirst().orElseThrow(),
                RecordType.WRONG_CREDENTIALS);
    }
}
