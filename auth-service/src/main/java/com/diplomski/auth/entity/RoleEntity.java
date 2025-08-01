package com.diplomski.auth.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class RoleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String name;
}
