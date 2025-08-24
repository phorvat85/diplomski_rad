package com.diplomski.util.service;

import com.diplomski.util.entity.RoleEntity;
import com.diplomski.util.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.beanutils.BeanUtilsBean;
import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final BeanUtilsBean beanUtilsBean;

    public List<RoleEntity> getAllRoles() {
        return roleRepository.findAll();
    }

    public void createRole(RoleEntity role) throws BadRequestException {
        if (role.getId() == null) {
            roleRepository.save(role);
        } else {
            throw new BadRequestException("Role already exists");
        }
    }

    public void updateRole(RoleEntity role) throws ChangeSetPersister.NotFoundException, InvocationTargetException, IllegalAccessException {
        Optional<RoleEntity> savedRole = roleRepository.findById(role.getId());
        if (savedRole.isPresent()) {
            beanUtilsBean.copyProperties(savedRole.get(), role);
            roleRepository.save(savedRole.get());
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
