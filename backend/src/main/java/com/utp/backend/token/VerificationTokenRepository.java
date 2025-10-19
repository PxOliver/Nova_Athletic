package com.utp.backend.token;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
   // Método personalizado para encontrar un VerificationToken por su valor de token.
    VerificationToken findByToken(String token);
}