package com.diplomski.auth.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class TaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String key;
    private String title;
    private String description;
    private String assignee;
}
