/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package io.sirchri.ess.controller;

import io.sirchri.ess.model.GenericEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import io.sirchri.ess.repository.GenericRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.RequestParam;

public abstract class GenericService<T extends GenericEntity<T>> {

    private final GenericRepository<T> repository;

    public GenericService(GenericRepository<T> repository) {
        this.repository = repository;
    }

    public Page<T> getPage(Integer page, Integer pageSize, String sortBy, String sortDir){
        Sort sort = null;
        Pageable paging  = PageRequest.of(page, pageSize);
        
        if (sortBy != null) {
            sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
            paging  = PageRequest.of(page, pageSize, sort);
        }
        
        return repository.findAll(paging);
    }

    public T get(Long id){
        return repository.findById(id).orElseThrow(
                () -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "entity not found"
                  )
        );
    }

    @Transactional
    public T update(T updated){
        T dbDomain = get(updated.getId());
        dbDomain.update(updated);

        return repository.save(dbDomain);
    }

    @Transactional
    public T create(T newDomain){
        T dbDomain = newDomain.createNewInstance();
        return repository.save(dbDomain);
    }

    @Transactional
    public void delete(Long id){
        //check if object with this id exists
        get(id);
        repository.deleteById(id);
    }
}