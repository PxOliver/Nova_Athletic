package com.utp.backend.Service.Auth;

import com.utp.backend.Model.Usuario;
import com.utp.backend.Repository.UserRepo;
import com.utp.backend.Util.JwtUtils;
import com.utp.backend.listener.RegistrationCompleteEvent;
import com.utp.backend.token.VerificationToken;
import com.utp.backend.token.VerificationTokenRepository;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private UserRepo userRepo;
    @Autowired private VerificationTokenRepository tokenRepository;
    @Autowired private ApplicationEventPublisher eventPublisher;
    @Autowired private JwtUtils jwtUtils;

    @Override
    public String login(String username, String password) {

        // 1. Buscar usuario en BD
        Usuario user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!user.isEnabled()) {
            throw new RuntimeException("La cuenta no ha sido verificada");
        }

        // 2. Autenticar credenciales
        var authToken = new UsernamePasswordAuthenticationToken(username, password);
        var authentication = authenticationManager.authenticate(authToken);

        // 3. Generar JWT con username + rol del usuario
        String token = jwtUtils.generateToken(
                ((UserDetails) authentication.getPrincipal()).getUsername(),
                user.getRol()  // 👈 aquí va "ADMIN", "USER", etc. desde la BD
        );

        return token;
    }

    @Override
    public String verifyToken(String token) {
        return jwtUtils.getUsernameFromToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido"));
    }

    @Override
    public String signUp(String nombre, String username, String password, String email) {

        if (userRepo.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepo.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        Usuario user = new Usuario();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setNombre(nombre);
        user.setEmail(email);
        user.setFechaRegistro(LocalDateTime.now());
        user.setEnabled(false);
        // Opcional: asignar rol por defecto si no lo manejas en la BD
        // user.setRol("USER");

        userRepo.save(user);

        eventPublisher.publishEvent(new RegistrationCompleteEvent(user, "..."));

        return "Verification email sent";
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @Override
    public void saveUserVerificationToken(Usuario user, String token) {
        tokenRepository.save(new VerificationToken(token, user));
    }

    @Override
    public String validateToken(String tokenString) {

        VerificationToken token = tokenRepository.findByToken(tokenString);
        if (token == null) return "Token de verificación no válido";

        Usuario user = token.getUser();

        Calendar now = Calendar.getInstance();
        if (token.getExpirationTime().getTime() - now.getTimeInMillis() <= 0) {
            tokenRepository.delete(token);
            return "expired";
        }

        user.setEnabled(true);
        userRepo.save(user);
        tokenRepository.delete(token);

        return "valido";
    }

    @Override
    public Usuario findByUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}