package com.diplomski.consumer.kafka;

import com.diplomski.util.RecordType;
import lombok.Data;

@Data
public class UserConsumerRecord {
    private Long userId;
    private RecordType recordType;
}
