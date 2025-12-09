package com.utp.backend.Util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

public class JwtUtils {

    private static final SecretKey SECRET_KEY = Jwts.SIG.HS256.key().build();
    private static final String ISSUER = "server";

    private JwtUtils() {}

    public static boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            System.out.println("Token inválido: " + e.getMessage());
            return false;
        }
    }

    public static Optional<String> getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return Optional.ofNullable(claims.getSubject());

        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public static String generateToken(String username) {

        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + (60 * 60 * 1000)); // 1 hora

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .issuer(ISSUER)
                .subject(username)
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(SECRET_KEY)
                .compact();
    }
}