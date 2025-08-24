package com.diplomski.util.DTOs;

import lombok.Data;

@Data
public class PasswordResetDTO {
    private Long id;
    private String oldPassword;
    private String newPassword;
}
