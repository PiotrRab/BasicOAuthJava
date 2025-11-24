package com.basic.auth;

import com.basic.config.JwtTokenProvider;
import com.basic.users.UserModel;
import com.basic.users.UserResponse;
import com.basic.users.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {
        UserModel user = userService.login(request.getEmail());
        return getUserResponseResponseEntity(user.getEmail(), user.getId());
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody LoginRequest request) {
        UserResponse user = userService.addUser(request);
        return getUserResponseResponseEntity(user.getEmail(), user.getId());
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {

        if (refreshToken == null || !jwtTokenProvider.validateRefreshToken(refreshToken)) {
            return ResponseEntity.status(401).build();
        }

        String email = jwtTokenProvider.getEmailFromRefreshToken(refreshToken);
        String newAccess = jwtTokenProvider.generateAccessToken(email);

        ResponseCookie newAccessCookie = ResponseCookie.from("accessToken", newAccess)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(900)
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", newAccessCookie.toString())
                .build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        Cookie access = new Cookie("accessToken", null);
        access.setPath("/");
        access.setHttpOnly(true);
        access.setSecure(false);
        access.setMaxAge(0);

        Cookie refresh = new Cookie("refreshToken", null);
        refresh.setPath("/");
        refresh.setHttpOnly(true);
        refresh.setSecure(false);
        refresh.setMaxAge(0);

        response.addCookie(access);
        response.addCookie(refresh);

        return ResponseEntity.ok("Logged out");
    }

    @GetMapping("/me")
    public boolean me(HttpServletRequest request) {
        String email = jwtTokenProvider.getEmailFromTokenInCookies(request);
        return email != null;
    }

    private ResponseEntity<UserResponse> getUserResponseResponseEntity(String email, UUID id) {
        String accessToken = jwtTokenProvider.generateAccessToken(email);
        String refreshToken = jwtTokenProvider.generateRefreshToken(email);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(900)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", accessCookie.toString())
                .header("Set-Cookie", refreshCookie.toString())
                .body(
                        UserResponse.builder()
                                .id(id)
                                .email(email)
                                .build()
                );
    }

}

