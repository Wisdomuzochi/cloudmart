package com.cloudmart.userservice;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.cloudmart.userservice.model.User;
import com.cloudmart.userservice.repository.UserRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        if (!userRepository.existsByEmail("admin@cloudmart.com")) {
            User admin = new User();
            admin.setEmail("admin@cloudmart.com");
            admin.setPassword(passwordEncoder.encode("Admin123!"));
            admin.setFirstName("Admin");
            admin.setLastName("CloudMart");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("✅ Compte admin créé : admin@cloudmart.com / Admin123!");
        }
    }
}
