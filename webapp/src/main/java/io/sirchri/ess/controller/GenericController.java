/*
 * Copyright (c) 2024 Christian Londero
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package io.sirchri.ess.controller;

import io.sirchri.ess.controller.dto.GetFilterDto;
import io.sirchri.ess.model.GenericEntity;
import io.sirchri.ess.repository.GenericRepository;
import static io.sirchri.ess.util.EntityUtils.entityToMap;
import static io.sirchri.ess.util.EntityUtils.listOfEntitiesToListOfMaps;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * Abstract base controller for handling CRUD operations on generic entities.
 * @param <T> the type of the entity
 */
public abstract class GenericController<T extends GenericEntity<T>> {
    // Logger for logging information and errors
    private static final Logger logger = LoggerFactory.getLogger(GenericController.class);

    // Reference to the generic service and repository
    private final GenericService<T> service;
    protected final GenericRepository<T> repo;

    /**
     * Constructor to initialize the controller with a generic repository.
     * @param repository the generic repository
     */
    public GenericController(GenericRepository<T> repository) {
        // Initialize the service and repository
        this.service = new GenericService<T>(repository) {};
        this.repo = repository;
    }

    /**
     * Handles the POST request for retrieving a filtered list of entities.
     * @param params the parameters for filtering and pagination
     * @return the filtered list of entities and metadata
     */
    @PostMapping("/list")
    public ResponseEntity<Map<String, Object>> getList(@RequestBody GetFilterDto params) {
        // Create a map to hold the response data
        Map<String, Object> out = new HashMap<>();

        // Convert filters to a JPA specification for querying
        Specification<T> specification = null;
        if (params.getFilters() != null) {
            specification = createSpecificationFromFilters(params.getFilters());
        }

        // Check if pagination is required
        if (params.getPage() != null && params.getPage() != -1) {
            // Get paginated results
            Page<T> pageRes = service.getPage(params.getPage(), params.getLimit(), params.getSortBy(), params.getSortDir(), specification);
            // Add data and count to the response map
            out.put("data", listOfEntitiesToListOfMaps(pageRes.getContent()));
            out.put("count", pageRes.getTotalElements());
        } else {
            // Get non-paginated results
            List<T> data = service.getList(params.getSortBy(), params.getSortDir(), specification);
            out.put("data", listOfEntitiesToListOfMaps(data));
            out.put("count", data.size());
        }

        // Return the response entity with status OK and the data map
        return ResponseEntity.ok(out);
    }

    /**
     * Handles the GET request for retrieving a single entity by its ID.
     * @param id the ID of the entity
     * @return the entity as a map
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map> getOne(@PathVariable Long id) {
        // Retrieve the entity by ID and return as a map
        return ResponseEntity.ok(entityToMap(service.get(id)));
    }

    /**
     * Handles the PUT request for updating an entity by its ID.
     * @param id the ID of the entity
     * @param updated the updated entity data
     * @return the updated entity as a map
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map> update(@PathVariable Long id, @RequestBody T updated) {
        // Retrieve the existing entity
        T record = service.get(id);
        // Check if the ID of the updated entity matches the provided ID
        if (!Objects.equals(updated.getId(), id)) {
            // Throw an exception if IDs do not match
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID mismatch");
        }
        
        // Update the entity and return the updated entity as a map
        return ResponseEntity.ok(entityToMap(service.update(updated)));
    }

    /**
     * Handles the POST request for creating a new entity.
     * @param created the new entity data
     * @return the created entity as a map
     */
    @PostMapping("")
    public ResponseEntity<Map> create(@RequestBody T created) {
        // Create the new entity and return it as a map
        return ResponseEntity.ok(entityToMap(service.create(created)));
    }

    /**
     * Handles the DELETE request for deleting an entity by its ID.
     * @param id the ID of the entity
     * @return the deleted entity as a map
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map> delete(@PathVariable Long id) {
        // Retrieve the entity to be deleted
        Map record = entityToMap(service.get(id));
        // Delete the entity
        service.delete(id);
        // Return the deleted entity as a map
        return ResponseEntity.ok(record);
    }

    /**
     * Converts filters to a JPA specification.
     * @param filters the filters to convert
     * @return the specification object
     */
    private Specification<T> createSpecificationFromFilters(Map<String, Map<String, Object>> filters) {
        // Initialize a blank specification
        Specification<T> specification = Specification.where(null);

        // Loop through each filter entry
        for (Map.Entry<String, Map<String, Object>> filterEntry : filters.entrySet()) {
            String field = filterEntry.getKey();
            Map<String, Object> filterConditions = filterEntry.getValue();

            // Apply each condition as a specification
            for (Map.Entry<String, Object> conditionEntry : filterConditions.entrySet()) {
                String operator = conditionEntry.getKey();
                Object value = conditionEntry.getValue();

                // Apply condition based on operator and value
                specification = applyCondition(specification, field, operator, value);
            }
        }

        // Return the final specification
        return specification;
    }

    /**
     * Applies a condition to a JPA specification.
     * @param specification the current specification
     * @param field the field to apply the condition on
     * @param operator the operator for the condition
     * @param value the value for the condition
     * @return the updated specification
     */
    private Specification<T> applyCondition(Specification<T> specification, String field, String operator, Object value) {
        return switch (operator) {
            // Equality condition
            case "equals" -> specification.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(field), value));
            // Greater than condition
            case "greaterThan" -> specification.and((root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(root.get(field), (Comparable) value));
            // Less than condition
            case "lessThan" -> specification.and((root, query, criteriaBuilder) -> criteriaBuilder.lessThan(root.get(field), (Comparable) value));
            // Like condition
            case "like" -> specification.and((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(field), "%" + value + "%"));
            // Case-insensitive like condition
            case "ilike" -> specification.and((root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower(root.get(field)), criteriaBuilder.lower(criteriaBuilder.literal("%" + value + "%"))));
            // In condition
            case "in" -> specification.and((root, query, criteriaBuilder) -> root.get(field).in((List<?>) value));
            // Unsupported operator
            default -> throw new IllegalArgumentException("Unsupported operator: " + operator);
        };
    }
}