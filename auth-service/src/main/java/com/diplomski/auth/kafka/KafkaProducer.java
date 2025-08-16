package com.diplomski.auth.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Log4j2
public class KafkaProducer {

    @Value(value = "${spring.kafka.topic-name}")
    private String topicName;

    private final KafkaTemplate<String, UserProducerRecord> kafkaTemplate;

    public void sendMessage(UserProducerRecord record) {
        log.info("Sending record: {} to topic: {}", record, topicName);
        kafkaTemplate.send(topicName, record);
    }
}
