package com.diplomski.auth.service;

import com.diplomski.auth.entity.RoleEntity;
import com.diplomski.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    public List<RoleEntity> getAllRoles() {
        return roleRepository.findAll();
    }

    public void createRole(RoleEntity role) throws BadRequestException {
        if (roleRepository.findByName(role.getName()).isEmpty()) {
            roleRepository.save(role);
        } else {
            throw new BadRequestException("Task already exists");
        }
    }

    public void updateRole(RoleEntity role) throws ChangeSetPersister.NotFoundException {
        if (roleRepository.findById(role.getId()).isPresent()) {
            roleRepository.save(role);
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    public void deleteRole(Long id) throws ChangeSetPersister.NotFoundException {
        Optional<RoleEntity> role = roleRepository.findById(id);
        if (role.isPresent()) {
            roleRepository.delete(role.get());
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
