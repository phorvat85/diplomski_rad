package com.diplomski.auth.controller;

import com.diplomski.auth.entity.RoleEntity;
import com.diplomski.auth.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping("/role/roles")
    public ResponseEntity<List<RoleEntity>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @PostMapping("/role/create")
    public ResponseEntity<?> createRole(@RequestBody RoleEntity role) {
        try {
            roleService.createRole(role);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/role/update")
    public ResponseEntity<?> updateRole(@RequestBody RoleEntity role) {
        try {
            roleService.updateRole(role);
            return ResponseEntity.status(HttpStatus.FOUND).build();
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/role/delete/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable(name = "id") String id) {
        try {
            roleService.deleteRole(Long.valueOf(id));
            return ResponseEntity.status(HttpStatus.FOUND).build();
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
