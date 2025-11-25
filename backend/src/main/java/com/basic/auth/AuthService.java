package com.basic.auth;

import com.basic.config.JwtTokenProvider;
import com.basic.users.UserModel;
import com.basic.users.UserRepository;
import com.basic.users.UserResponse;
import com.basic.users.UserRole;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class AuthService {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public ResponseEntity<UserResponse> login(LoginRequest request) {
        UserModel user = userRepository.findByEmail(request.getEmail()).orElseThrow(NullPointerException::new);
        return getUserResponse(user.getEmail(), user.getId());
    }

    public ResponseEntity<UserResponse> register(LoginRequest request) {
        UserModel user = new UserModel();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);
        userRepository.save(user);
        return getUserResponse(user.getEmail(), user.getId());
    }

    public ResponseCookie refresh(String refreshToken) {
        String email = jwtTokenProvider.getEmailFromRefreshToken(refreshToken);
        String newAccess = jwtTokenProvider.generateAccessToken(email);

        return ResponseCookie.from("accessToken", newAccess)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(900)
                .build();
    }

    public void logout(HttpServletResponse response) {
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
    }


    private ResponseEntity<UserResponse> getUserResponse(String email, UUID id) {
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
