package com.diplomski.util.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class TaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, name = "task_key")
    private String taskKey;
    private String title;
    private String description;
    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private UserEntity assignee;
    private String estimation;
}
