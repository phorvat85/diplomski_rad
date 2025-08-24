package com.diplomski.util.DTOs;

import lombok.Data;

@Data
public class BasicUserUpdateDTO {
    private Long id;
    private String username;
    private String email;
}
