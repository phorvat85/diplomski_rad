package com.diplomski.util.DTOs;

import com.diplomski.util.entity.RoleEntity;
import lombok.Data;

@Data
public class UserMeDTO {
    private Long id;
    private String email;
    private String username;
    private RoleEntity role;
    private Boolean enabled = true;
    private Boolean accountNonExpired = true;
    private Boolean credentialsNonExpired = true;
    private Boolean accountNonLocked = true;
    private Integer failedLoginAttempts = 0;
}
