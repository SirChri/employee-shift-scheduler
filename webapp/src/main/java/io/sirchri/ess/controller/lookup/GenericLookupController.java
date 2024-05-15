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

package io.sirchri.ess.controller.lookup;

import io.sirchri.ess.controller.dto.GetFilterDto;
import io.sirchri.ess.model.lookup.GenericLookupEntity;
import io.sirchri.ess.repository.lookup.GenericLookupRepository;
import static io.sirchri.ess.util.EntityUtils.entityToMap;
import static io.sirchri.ess.util.EntityUtils.listOfEntitiesToListOfMaps;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Abstract base controller for handling CRUD operations on generic entities.
 * @param <T> the type of the entity
 */
public abstract class GenericLookupController<T extends GenericLookupEntity<T>> {
    // Logger for logging information and errors
    private static final Logger logger = LoggerFactory.getLogger(GenericLookupController.class);

    // Reference to the generic service and repository
    private final GenericLookupService<T> service;
    protected final GenericLookupRepository<T> repo;

    /**
     * Constructor to initialize the controller with a generic repository.
     * @param repository the generic repository
     */
    public GenericLookupController(GenericLookupRepository<T> repository) {
        // Initialize the service and repository
        this.service = new GenericLookupService<T>(repository) {};
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
        
        List<T> data = service.getList();
        out.put("data", listOfEntitiesToListOfMaps(data));
        out.put("count", data.size());

        // Return the response entity with status OK and the data map
        return ResponseEntity.ok(out);
    }

    /**
     * Handles the GET request for retrieving a single entity by its ID.
     * @param id the ID of the entity
     * @return the entity as a map
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map> getOne(@PathVariable String id) {
        // Retrieve the entity by ID and return as a map
        return ResponseEntity.ok(entityToMap(service.get(id)));
    }
}