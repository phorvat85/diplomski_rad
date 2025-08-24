package com.diplomski.auth;

import com.diplomski.auth.kafka.KafkaProducer;
import com.diplomski.auth.kafka.UserProducerRecord;
import com.diplomski.util.service.CustomUserDetailsService;
import com.diplomski.util.RecordType;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@RequiredArgsConstructor
public class AuthEventsListener {

    private final KafkaProducer kafkaProducer;
    private final CustomUserDetailsService customUserDetailsService;

    @EventListener
    public void badCredentialsListener(AuthenticationFailureBadCredentialsEvent event) {
        log.error("Invalid credentials, sending failed login event to Kafka.");
        kafkaProducer
                .sendMessage(generateProducerRecord(event.getAuthentication().getName(), RecordType.WRONG_CREDENTIALS));
    }

    @EventListener
    public void successfulLoginListener(AuthenticationSuccessEvent event) {
        log.info("Login successful for user {}, sending success login event to Kafka.", event.getAuthentication().getName());
        kafkaProducer
                .sendMessage(generateProducerRecord(event.getAuthentication().getName(), RecordType.SUCCESSFUL_LOGIN));
    }

    private UserProducerRecord generateProducerRecord(String username, RecordType recordType) {
        return new UserProducerRecord(customUserDetailsService
                .loadUserByUsername(username).getId(), recordType);
    }
}
