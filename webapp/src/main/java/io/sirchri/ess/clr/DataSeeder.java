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
package io.sirchri.ess.clr;

import io.sirchri.ess.model.ERole;
import io.sirchri.ess.model.Role;
import io.sirchri.ess.model.User;
import io.sirchri.ess.repository.RoleRepository;
import io.sirchri.ess.repository.UserRepository;
import java.util.Arrays;
import java.util.HashSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository; // Assuming you have a UserRepository
    
    @Autowired
    private RoleRepository roleRepo;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepo.findByName(ERole.ROLE_USER).isEmpty()) {
            Role user = new Role();
            user.setName(ERole.ROLE_USER);
            roleRepo.save(user);
            
            Role mod = new Role();
            mod.setName(ERole.ROLE_MODERATOR);
            roleRepo.save(mod);
            
            Role admin = new Role();
            admin.setName(ERole.ROLE_ADMIN);
            roleRepo.save(admin);

            // Check if the admin user already exists
            if (userRepository.findByUsername("admin").isEmpty()) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@example.com");
                adminUser.setPassword(new BCryptPasswordEncoder().encode("admin")); // Securely hash the password
                adminUser.setRoles(new HashSet<>(Arrays.asList(admin)));
                // Add any additional admin user details
                userRepository.save(adminUser);
            }
        }
    }
}