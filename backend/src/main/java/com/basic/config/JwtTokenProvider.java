package com.basic.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecretBase64;

    @Value("${jwt.refresh-secret}")
    private String refreshSecretBase64;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpirationMs;

    private SecretKey getAccessKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecretBase64));
    }

    private SecretKey getRefreshKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(refreshSecretBase64));
    }

    public String generateAccessToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getAccessKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpirationMs))
                .signWith(getRefreshKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getEmailFromAccessToken(String token) {
        return getClaims(token, getAccessKey()).getSubject();
    }

    public String getEmailFromRefreshToken(String token) {
        return getClaims(token, getRefreshKey()).getSubject();
    }

    private Claims getClaims(String token, SecretKey key) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateAccessToken(String token) {
        return validate(token, getAccessKey());
    }

    public boolean validateRefreshToken(String token) {
        return validate(token, getRefreshKey());
    }

    private boolean validate(String token, SecretKey key) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getEmailFromTokenInCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if ("accessToken".equals(cookie.getName())) {

                String token = cookie.getValue();

                if (validateAccessToken(token)) {
                    return getEmailFromAccessToken(token);
                } else {
                    return null;
                }
            }
        }

        return null;
    }
}
