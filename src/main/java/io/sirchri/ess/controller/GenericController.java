/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package io.sirchri.ess.controller;

import io.sirchri.ess.model.GenericEntity;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import io.sirchri.ess.repository.GenericRepository;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestParam;

public abstract class GenericController<T extends GenericEntity<T>> {

    private final GenericService<T> service;

    public GenericController(GenericRepository<T> repository) {
        this.service = new GenericService<T>(repository) {};
    }

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> getList(
            @RequestParam(defaultValue = "50", required = false) 
                  Integer limit,
            @RequestParam(defaultValue = "0", required = false) 
                  Integer page,
            @RequestParam(defaultValue = "asc", required = false) 
                  String sortDir,
            @RequestParam(required = false) 
                  String sortBy){
        Page<T> pageRes = service.getPage(page, limit, sortBy, sortDir);
        Map<String, Object> out = new HashMap<>();
        out.put("data", pageRes.getContent());
        out.put("metadata", Map.of(
            "count", pageRes.getTotalElements(),
            "pages", pageRes.getTotalPages()
        ));
            
        return ResponseEntity.ok(out);
    }

    @GetMapping("/{id}")
    public ResponseEntity<T> getOne(@PathVariable Long id){
        return ResponseEntity.ok(service.get(id));
    }

    @PutMapping("")
    public ResponseEntity<T> update(@RequestBody T updated){
        return ResponseEntity.ok(service.update(updated));
    }

    @PostMapping("")
    public ResponseEntity<T> create(@RequestBody T created){
        return ResponseEntity.ok(service.create(created));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<T> delete(@PathVariable Long id){
        T record = service.get(id);
        service.delete(id);
        return ResponseEntity.ok(record);
    }
}