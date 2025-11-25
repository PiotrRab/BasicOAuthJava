package com.basic.auth;

import com.basic.config.JwtTokenProvider;
import com.basic.users.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void login_shouldDelegateToService() {
        LoginRequest request = new LoginRequest();
        request.setEmail("a@a.com");
        request.setPassword("p");

        UserResponse userResponse = UserResponse.builder().email("a@a.com").build();
        ResponseEntity<UserResponse> mockResponse = ResponseEntity.ok(userResponse);

        when(authService.login(request)).thenReturn(mockResponse);

        ResponseEntity<UserResponse> result = authController.login(request);

        assertEquals(mockResponse, result);
        verify(authService, times(1)).login(request);
    }

    @Test
    void register_shouldDelegateToService() {
        LoginRequest request = new LoginRequest();
        request.setEmail("a@a.com");
        request.setPassword("p");

        UserResponse userResponse = UserResponse.builder().email("a@a.com").build();
        ResponseEntity<UserResponse> mockResponse = ResponseEntity.ok(userResponse);

        when(authService.register(request)).thenReturn(mockResponse);

        ResponseEntity<UserResponse> result = authController.register(request);

        assertEquals(mockResponse, result);
        verify(authService, times(1)).register(request);
    }

    @Test
    void refreshToken_shouldReturn401WhenInvalid() {
        ResponseEntity<?> response = authController.refreshToken(null);

        assertEquals(401, response.getStatusCode().value());
    }

    @Test
    void refreshToken_shouldReturnNewAccessCookie() {
        when(jwtTokenProvider.validateRefreshToken("REF")).thenReturn(true);

        ResponseCookie cookie = ResponseCookie.from("accessToken", "NEW").build();
        when(authService.refresh("REF")).thenReturn(cookie);

        ResponseEntity<?> response = authController.refreshToken("REF");

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getHeaders().containsKey("Set-Cookie"));
        verify(authService, times(1)).refresh("REF");
    }

    @Test
    void logout_shouldCallService() {
        HttpServletResponse response = mock(HttpServletResponse.class);

        ResponseEntity<?> result = authController.logout(response);

        verify(authService, times(1)).logout(response);
        assertEquals(200, result.getStatusCode().value());
    }

    @Test
    void me_shouldReturnTrueWhenEmailExists() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(jwtTokenProvider.getEmailFromTokenInCookies(request)).thenReturn("mail@mail.com");

        boolean result = authController.me(request);

        assertTrue(result);
    }

    @Test
    void me_shouldReturnFalseWhenNoEmail() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(jwtTokenProvider.getEmailFromTokenInCookies(request)).thenReturn(null);

        boolean result = authController.me(request);

        assertFalse(result);
    }
}
