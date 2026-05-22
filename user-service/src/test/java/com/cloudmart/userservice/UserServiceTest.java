package com.cloudmart.userservice;

import com.cloudmart.userservice.dto.LoginRequest;
import com.cloudmart.userservice.dto.RegisterRequest;
import com.cloudmart.userservice.model.User;
import com.cloudmart.userservice.repository.UserRepository;
import com.cloudmart.userservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User fakeUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        fakeUser = new User();
        fakeUser.setId(1L);
        fakeUser.setEmail("wisdom@test.com");
        fakeUser.setPassword("hashed_password");
        fakeUser.setFirstName("Wisdom");
        fakeUser.setLastName("MUONAKA");
        fakeUser.setRole("CUSTOMER");

        registerRequest = new RegisterRequest();
        registerRequest.setEmail("wisdom@test.com");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("Wisdom");
        registerRequest.setLastName("MUONAKA");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("wisdom@test.com");
        loginRequest.setPassword("password123");
    }

    // ── Tests Register ───────────────────────────────────────

    @Test
    void register_ShouldCreateUser_WhenEmailNotExists() {
        // GIVEN
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(fakeUser);

        // WHEN
        User result = userService.register(registerRequest);

        // THEN
        assertNotNull(result);
        assertEquals("wisdom@test.com", result.getEmail());
        assertEquals("Wisdom", result.getFirstName());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        // GIVEN
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // WHEN + THEN
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> userService.register(registerRequest)
        );

        assertTrue(exception.getMessage().contains("Email déjà utilisé"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_ShouldEncodePassword() {
        // GIVEN
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(fakeUser);

        // WHEN
        userService.register(registerRequest);

        // THEN
        verify(passwordEncoder, times(1)).encode("password123");
    }

    // ── Tests Login ──────────────────────────────────────────

    @Test
    void login_ShouldReturnUser_WhenCredentialsAreCorrect() {
        // GIVEN
        when(userRepository.findByEmail("wisdom@test.com"))
            .thenReturn(Optional.of(fakeUser));
        when(passwordEncoder.matches("password123", "hashed_password"))
            .thenReturn(true);

        // WHEN
        User result = userService.login(loginRequest);

        // THEN
        assertNotNull(result);
        assertEquals("wisdom@test.com", result.getEmail());
    }

    @Test
    void login_ShouldThrowException_WhenUserNotFound() {
        // GIVEN
        when(userRepository.findByEmail(anyString()))
            .thenReturn(Optional.empty());

        // WHEN + THEN
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> userService.login(loginRequest)
        );

        assertTrue(exception.getMessage().contains("Utilisateur introuvable"));
    }

    @Test
    void login_ShouldThrowException_WhenPasswordIsWrong() {
        // GIVEN
        when(userRepository.findByEmail("wisdom@test.com"))
            .thenReturn(Optional.of(fakeUser));
        when(passwordEncoder.matches("password123", "hashed_password"))
            .thenReturn(false);

        // WHEN + THEN
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> userService.login(loginRequest)
        );

        assertTrue(exception.getMessage().contains("Mot de passe incorrect"));
    }

    // ── Tests FindById ───────────────────────────────────────

    @Test
    void findById_ShouldReturnUser_WhenExists() {
        // GIVEN
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(fakeUser));

        // WHEN
        User result = userService.findById(1L);

        // THEN
        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void findById_ShouldThrowException_WhenNotFound() {
        // GIVEN
        when(userRepository.findById(99L))
            .thenReturn(Optional.empty());

        // WHEN + THEN
        assertThrows(
            RuntimeException.class,
            () -> userService.findById(99L)
        );
    }
}
