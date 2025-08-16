package com.diplomski.auth.kafka;

import com.diplomski.util.RecordType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProducerRecord {
    private Long userId;
    private RecordType recordType;
}
