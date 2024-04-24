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

package io.sirchri.ess.security;

import io.sirchri.ess.security.services.CustomUserDetailsService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
@AllArgsConstructor
@EnableMethodSecurity
// @EnableJdbcHttpSession: Uncomment if you want to use JDBC for session management
public class SecurityConfig {

    // Injecting custom user details service and unauthorized entry point handler
    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private AuthEntryPoint unauthorizedHandler;

    /**
     * Creates a bean for PasswordEncoder using BCrypt algorithm for password encryption.
     *
     * @return PasswordEncoder instance.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures HTTP security settings and returns the configured SecurityFilterChain.
     *
     * @param http The HttpSecurity instance to configure.
     * @return SecurityFilterChain instance with configured settings.
     * @throws Exception If an error occurs during configuration.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Disable CSRF protection
        http.csrf(csrf -> csrf.disable())
            // Allow same-origin requests (needed for frames)
            .headers(h -> h.frameOptions(fo -> fo.sameOrigin()))
            // Set up authentication entry point handler for exceptions
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            // Configure authorization rules for different URL patterns
            .authorizeHttpRequests(auth -> {
                // Allow public access to URLs matching '/ui/**', '/error', and '/api/login'
                auth.requestMatchers(antMatcher("/")).permitAll();
                auth.requestMatchers(antMatcher("/ui/**")).permitAll();
                auth.requestMatchers(antMatcher("/error")).permitAll();
                auth.requestMatchers(antMatcher("/api/login")).permitAll();
                // Require authentication for URLs matching '/api/logout' and '/api/**'
                auth.requestMatchers(antMatcher("/api/logout")).authenticated();
                auth.requestMatchers(antMatcher("/api/**")).authenticated();
            });
        return http.build();
    }

    /**
     * Creates a bean for AuthenticationManager.
     *
     * @param configuration The AuthenticationConfiguration instance.
     * @return AuthenticationManager instance.
     * @throws Exception If an error occurs during configuration.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * Creates a bean for SecurityContextRepository using HttpSessionSecurityContextRepository.
     *
     * @return SecurityContextRepository instance.
     */
    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }
}