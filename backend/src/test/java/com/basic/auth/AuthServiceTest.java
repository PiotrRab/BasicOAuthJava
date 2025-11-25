package com.basic.auth;

import com.basic.config.JwtTokenProvider;
import com.basic.users.UserModel;
import com.basic.users.UserRepository;
import com.basic.users.UserResponse;
import com.basic.users.UserRole;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void login_shouldReturnUserResponse() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@mail.com");
        request.setPassword("pass");

        UserModel user = new UserModel();
        user.setEmail("test@mail.com");
        user.setId(UUID.randomUUID());
        user.setRole(UserRole.USER);

        when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));
        when(jwtTokenProvider.generateAccessToken(anyString())).thenReturn("access");
        when(jwtTokenProvider.generateRefreshToken(anyString())).thenReturn("refresh");

        ResponseEntity<UserResponse> response = authService.login(request);

        assertNotNull(response);
        assertNotNull(response.getBody());
        assertEquals("test@mail.com", response.getBody().getEmail());
        assertEquals(user.getId(), response.getBody().getId());
    }

    @Test
    void register_shouldSaveUserAndReturnResponse() {
        LoginRequest request = new LoginRequest();
        request.setEmail("a@a.com");
        request.setPassword("pass");

        when(passwordEncoder.encode("pass")).thenReturn("ENCODED");
        when(jwtTokenProvider.generateAccessToken(anyString())).thenReturn("A");
        when(jwtTokenProvider.generateRefreshToken(anyString())).thenReturn("R");

        ResponseEntity<UserResponse> response = authService.register(request);

        verify(userRepository, times(1)).save(argThat(saved -> {
            return saved != null &&
                    saved.getEmail().equals("a@a.com") &&
                    saved.getPassword().equals("ENCODED");
        }));
        assertNotNull(response.getBody());
        assertEquals("a@a.com", response.getBody().getEmail());
    }

    @Test
    void refresh_shouldReturnNewAccessCookie() {
        when(jwtTokenProvider.getEmailFromRefreshToken("refresh")).thenReturn("mail@mail.com");
        when(jwtTokenProvider.generateAccessToken("mail@mail.com")).thenReturn("newAccess");

        ResponseCookie cookie = authService.refresh("refresh");

        assertNotNull(cookie);
        assertTrue(cookie.toString().startsWith("accessToken=newAccess"));
    }

    @Test
    void logout_shouldAddExpiredCookies() {
        HttpServletResponse response = mock(HttpServletResponse.class);

        authService.logout(response);

        verify(response, times(2)).addCookie(any());
    }
}
