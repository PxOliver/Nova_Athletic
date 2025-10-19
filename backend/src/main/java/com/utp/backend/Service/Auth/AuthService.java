package com.utp.backend.Service.Auth;

import com.utp.backend.Model.Usuario;
import java.util.Optional;

public interface AuthService {

    String login(String username, String password);
    String signUp(String nombre, String username, String password, String email);
    String verifyToken(String token);
    Optional<Usuario> findByEmail(String email);
    void saveUserVerificationToken(Usuario theUser, String verificationToken);
    String validateToken(String theToken);
    Usuario findByUsername(String username);
}