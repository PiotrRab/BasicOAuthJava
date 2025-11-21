package com.basic.auth;

import com.basic.users.UserResponse;
import lombok.Data;

@Data
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserResponse user;
}
