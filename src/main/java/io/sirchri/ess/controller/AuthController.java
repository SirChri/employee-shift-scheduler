/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package io.sirchri.ess.controller;

import io.sirchri.ess.security.services.AuthService;
import io.sirchri.ess.security.services.LoginDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api")
public class AuthController {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private SecurityContextRepository securityContextRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<Authentication> login(@RequestBody LoginDto loginDto, HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getUsername(), loginDto.getPassword()));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);

        return ResponseEntity.ok(authentication);
    }
    
    @RequestMapping(value = "/session", method = RequestMethod.GET)
    public ResponseEntity<String> session(HttpServletRequest request, HttpServletResponse response) {
        // Get the user's session and invalidate it
        HttpSession session = request.getSession(false);
        
        return ResponseEntity.ok(session.getId());
    }
    
    
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public ResponseEntity<Boolean> logout(HttpServletRequest request, HttpServletResponse response) {
        // Get the user's session and invalidate it
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // Log the user out using Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }

        return ResponseEntity.ok(true);
    }
}
