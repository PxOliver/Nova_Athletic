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

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder; 
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Override
    public String login(String username, String password) {
        Optional<Usuario> optionalUser = userRepo.findByUsername(username);

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        Usuario user = optionalUser.get();

        if (!user.isEnabled()) {
            throw new RuntimeException("La cuenta no ha sido verificada");
        }
        var authToken = new UsernamePasswordAuthenticationToken(username, password);
        var authenticate = authenticationManager.authenticate(authToken);
        return JwtUtils.generateToken(((UserDetails) (authenticate.getPrincipal())).getUsername());
    }

    @Override
    public String verifyToken(String token) {
        var usernameOptional = JwtUtils.getUsernameFromToken(token);
        if (usernameOptional.isPresent()) {
            return usernameOptional.get();
        }
        throw new RuntimeException("Token invalid");
    }

    @Override
    public String signUp(String nombre, String username, String password, String email) {

        if (userRepo.existsByUsername(username)) {
            throw new RuntimeException("El Username ya existe");
        }

        if (userRepo.existsByEmail(email)) {
            throw new RuntimeException("El correo electrónico ya existe");
        }

        Usuario user = new Usuario();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); 
        user.setNombre(nombre);
        user.setEmail(email);
        user.setFechaRegistro(LocalDateTime.now());
        user.setEnabled(false);
        user = userRepo.save(user);

        eventPublisher.publishEvent(new RegistrationCompleteEvent(user, "..."));

        return "Verification email sent";
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @Override
    public void saveUserVerificationToken(Usuario theUser, String token) {
        var verificationToken = new VerificationToken(token, theUser);
        tokenRepository.save(verificationToken);
    }

    @Override
    public String validateToken(String theToken) {

        VerificationToken token = tokenRepository.findByToken(theToken);
        if (token == null) {

            System.out.println("Token no encontrado en la base de datos.");
            return "Token de verificación no válido";
        }

        Usuario user = token.getUser();
        System.out.println("Estado actual del usuario: " + user.isEnabled());

        Calendar calendar = Calendar.getInstance();
        if ((token.getExpirationTime().getTime() - calendar.getTime().getTime()) <= 0) {

            tokenRepository.delete(token);
            System.out.println("Token expirado y eliminado.");
            return "expired";
        }

        user.setEnabled(true);
        try {

            userRepo.save(user);
            System.out.println("Usuario actualizado. Nuevo estado: " + user.isEnabled());

            tokenRepository.delete(token);
            return "valido";
        } catch (Exception e) {
            System.out.println("Error al guardar usuario: " + e.getMessage());
            e.printStackTrace();
            return "Error al actualizar usuario";
        }
        
    }
    @Override
    public Usuario findByUsername(String username) {
        return userRepo.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}