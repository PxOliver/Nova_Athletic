package com.utp.backend.Util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Component
public class JwtUtils {

    private final SecretKey secretKey;
    private static final String ISSUER = "server";

    public JwtUtils(@Value("${jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // ==========================
    // VALIDAR TOKEN
    // ==========================
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            System.out.println("Token inválido: " + e.getMessage());
            return false;
        }
    }

    // ==========================
    // OBTENER USERNAME
    // ==========================
    public Optional<String> getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return Optional.ofNullable(claims.getSubject());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // ==========================
    // OBTENER ROL
    // ==========================
    public Optional<String> getRoleFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return Optional.ofNullable(claims.get("role", String.class));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // ==========================
    // GENERAR TOKEN (username + role)
    // ==========================
    public String generateToken(String username, String role) {

        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + (60 * 60 * 1000L)); // 1 hora

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .issuer(ISSUER)
                .subject(username)
                .claim("role", role)  // 👈 aquí metemos el rol en el token
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(secretKey)
                .compact();
    }

    // (opcional) por si en algún sitio viejo se llamaba solo con username
    public String generateToken(String username) {
        return generateToken(username, null);
    }
}