package com.diplomski.consumer.kafka;

import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class KafkaConsumer {

    @KafkaListener(
            topics = "${spring.kafka.topic-name}",
            groupId = "${spring.kafka.group-id}"
    )
    public void eventListener(ConsumerRecord<String, UserConsumerRecord> record) {
        log.info("Consumed consumer record: {}", record.toString());
    }
}
