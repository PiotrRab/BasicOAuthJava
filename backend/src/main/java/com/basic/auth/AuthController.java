package com.basic.auth;

import com.basic.config.JwtTokenProvider;
import com.basic.users.UserResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody LoginRequest request) {
        return authService.register(request);
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null || !jwtTokenProvider.validateRefreshToken(refreshToken)) {
            return ResponseEntity.status(401).build();
        }
        ResponseCookie newAccessCookie = authService.refresh(refreshToken);

        return ResponseEntity.ok()
                .header("Set-Cookie", newAccessCookie.toString())
                .build();
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok("Logged out");
    }

    @GetMapping("/me")
    public boolean me(HttpServletRequest request) {
        String email = jwtTokenProvider.getEmailFromTokenInCookies(request);
        return email != null;
    }

}

