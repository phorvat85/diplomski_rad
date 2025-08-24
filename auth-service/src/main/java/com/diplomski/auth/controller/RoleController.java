package com.diplomski.auth.controller;

import com.diplomski.util.entity.RoleEntity;
import com.diplomski.util.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping("/manager/role/roles")
    public ResponseEntity<List<RoleEntity>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @PostMapping("/admin/role/create")
    public ResponseEntity<?> createRole(@RequestBody RoleEntity role) {
        try {
            roleService.createRole(role);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/admin/role/update")
    public ResponseEntity<?> updateRole(@RequestBody RoleEntity role) {
        try {
            roleService.updateRole(role);
            return ResponseEntity.status(HttpStatus.FOUND).build();
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (InvocationTargetException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/admin/role/delete/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable(name = "id") String id) {
        try {
            roleService.deleteRole(Long.valueOf(id));
            return ResponseEntity.status(HttpStatus.FOUND).build();
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
