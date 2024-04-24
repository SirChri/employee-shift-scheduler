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

package io.sirchri.ess.controller.user;

import io.sirchri.ess.controller.EventController;
import io.sirchri.ess.controller.dto.GetFilterDto;
import io.sirchri.ess.model.ERole;
import io.sirchri.ess.model.Role;
import io.sirchri.ess.model.User;
import io.sirchri.ess.repository.RoleRepository;
import io.sirchri.ess.repository.UserRepository;
import static io.sirchri.ess.util.EntityUtils.entityToMap;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(EventController.class);

    // Inject the RoleRepository and UserRepository using Spring's dependency injection
    @Autowired
    private RoleRepository roleRepo;
    
    private final UserService service;
    protected final UserRepository repo;

    // Constructor for the UserController, initializing the UserService and UserRepository
    public UserController(UserRepository repository) {
        this.service = new UserService(repository);
        this.repo = repository;
    }

    /**
     * Handles the POST request for retrieving a filtered list of entities.
     * Only users with the 'ROLE_ADMIN' authority can access this endpoint.
     * 
     * @param params the parameters for filtering and pagination
     * @return the filtered list of entities and metadata
     */
    @PostMapping("/list")
    public ResponseEntity<Map<String, Object>> getList(@RequestBody GetFilterDto params) {
        Page<User> pageRes = service.getPage(params.getPage(), params.getLimit(), params.getSortBy(), params.getSortDir());

        // Create a response map with the user data and total element count
        Map<String, Object> out = new HashMap<>();
        out.put("data", pageRes.getContent().stream()
                .map(this::secureMap)
                .collect(Collectors.toList()));
        out.put("count", pageRes.getTotalElements());

        return ResponseEntity.ok(out);
    }

    /**
     * Get details of a specific user by ID.
     * Only users with 'ROLE_ADMIN' can access this endpoint, 
     * or the user can access their own details.
     *
     * @param id The ID of the user to retrieve.
     * @return A ResponseEntity containing a map with the user's secure information.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or #id == authentication.principal.getId()")
    public ResponseEntity<Map> getUser(@PathVariable Long id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "entity not found"
                ));

        return ResponseEntity.ok(secureMap(user));
    }

    /**
     * Update the password of a user by ID.
     * Only users with 'ROLE_ADMIN' or the user themselves can access this endpoint.
     *
     * @param id The ID of the user to update.
     * @param updated The UserPasswordUpdateDto object containing the new password.
     * @return A ResponseEntity containing a map with the user's updated secure information.
     */
    @PutMapping("/password/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or #id == authentication.principal.getId()")
    public ResponseEntity<Map> updatePassword(@PathVariable Long id, @RequestBody UserPasswordUpdateDto updated) {
        User record = service.get(id);
        record.setPassword(new BCryptPasswordEncoder().encode(updated.getPassword())); // Securely hash the password

        return ResponseEntity.ok(secureMap(service.update(record)));
    }

    /**
     * Update a user by ID.
     * Only users with 'ROLE_ADMIN' or the user themselves can access this endpoint.
     *
     * @param id The ID of the user to update.
     * @param updated The User object containing the new user details.
     * @return A ResponseEntity containing a map with the user's updated secure information.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or #id == authentication.principal.getId()")
    public ResponseEntity<Map> update(@PathVariable Long id, @RequestBody User updated) {
        User record = service.get(id);
        if (!Objects.equals(updated.getId(), id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "id mismatch");
        }

        return ResponseEntity.ok(secureMap(service.update(updated)));
    }

    /**
     * Create a new user.
     * Only users with 'ROLE_ADMIN' can access this endpoint.
     *
     * @param created The UserCreateDto object containing the new user's details.
     * @return A ResponseEntity containing a map with the newly created user's secure information.
     */
    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Map> create(@RequestBody UserCreateDto created) {
        User user = new User();
        user.setUsername(created.getUsername());
        user.setEmail(created.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(created.getPassword())); // Securely hash the password

        Role role = roleRepo.findByName(ERole.valueOf(created.getRole()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "role not found"));

        user.setRoles(new HashSet<>(Arrays.asList(role)));

        return ResponseEntity.ok(secureMap(service.create(user)));
    }

    /**
     * Delete a user by ID.
     * Only users with 'ROLE_ADMIN' can access this endpoint.
     *
     * @param id The ID of the user to delete.
     * @return A ResponseEntity containing a map with the deleted user's secure information.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Map> delete(@PathVariable Long id) {
        Map record = secureMap(service.get(id));
        service.delete(id);
        return ResponseEntity.ok(record);
    }

    /**
     * Convert a User object into a secure map.
     * This method removes sensitive information, such as the password, before returning the map.
     *
     * @param user The User object to convert.
     * @return A map containing the user's secure information.
     */
    private Map<String, Object> secureMap(User user) {
        Map<String, Object> res = entityToMap(user);
        res.remove("password");
        return res;
    }
}