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

        // Verifica si el usuario está habilitado
        if (!user.isEnabled()) {
            throw new RuntimeException("La cuenta no ha sido verificada");
        }

        // Crea un token de autenticación con el nombre de usuario y la contraseña
        var authToken = new UsernamePasswordAuthenticationToken(username, password);

        // Autentica al usuario utilizando el AuthenticationManager
        var authenticate = authenticationManager.authenticate(authToken);

        // Genera y devuelve un token JWT utilizando el nombre de usuario autenticado.
        return JwtUtils.generateToken(((UserDetails) (authenticate.getPrincipal())).getUsername());
    }

    @Override
    public String verifyToken(String token) {
        // Obtiene el nombre de usuario del token.
        var usernameOptional = JwtUtils.getUsernameFromToken(token);
        // Si el token es válido, devuelve el nombre de usuario.
        if (usernameOptional.isPresent()) {
            return usernameOptional.get();
        }
        // Si el token no es válido, lanza una excepción.
        throw new RuntimeException("Token invalid");
    }

    @Override
    public String signUp(String nombre, String username, String password, String email) {

        // Verifica si el nombre de usuario ya existe en la base de datos.
        if (userRepo.existsByUsername(username)) {
            throw new RuntimeException("El Username ya existe");
        }
        // Verificar si el email ya existe
        if (userRepo.existsByEmail(email)) {
            throw new RuntimeException("El correo electrónico ya existe");
        }
        // Crear un nuevo objeto Usuario
        Usuario user = new Usuario();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); // La contraseña se cifra antes de guardarse
        user.setNombre(nombre);
        user.setEmail(email);

        // Establecer la fecha y hora de registro
        user.setFechaRegistro(LocalDateTime.now());
        user.setEnabled(false);

        user = userRepo.save(user);

        // Aquí deberías publicar el evento de registro
        eventPublisher.publishEvent(new RegistrationCompleteEvent(user, "..."));

        return "Verification email sent";
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        // Busca un usuario en la base de datos utilizando su correo electrónico.
        // Retorna un Optional que contiene al usuario si existe, o vacío si no se encuentra.
        return userRepo.findByEmail(email);
    }

    @Override
    public void saveUserVerificationToken(Usuario theUser, String token) {
        // Crea un nuevo token de verificación para el usuario proporcionado.
        // Se utiliza una clase llamada VerificationToken para almacenar el token y el usuario asociado.
        var verificationToken = new VerificationToken(token, theUser);
        // Guarda el token de verificación en el repositorio correspondiente.
        tokenRepository.save(verificationToken);
    }

    @Override
    public String validateToken(String theToken) {
        // Busca el token de verificación en el repositorio utilizando su valor.
        VerificationToken token = tokenRepository.findByToken(theToken);
        if (token == null) {
            // Si el token no se encuentra, imprime un mensaje en la consola y retorna un mensaje de error.
            System.out.println("Token no encontrado en la base de datos.");
            return "Token de verificación no válido";
        }

        // Obtiene el usuario asociado al token.
        Usuario user = token.getUser();
        System.out.println("Estado actual del usuario: " + user.isEnabled());

        // Verifica si el token ha expirado comparando la fecha de expiración con la fecha actual.
        Calendar calendar = Calendar.getInstance();
        if ((token.getExpirationTime().getTime() - calendar.getTime().getTime()) <= 0) {
            // Si el token ha expirado, lo elimina del repositorio y retorna un mensaje de expiración.
            tokenRepository.delete(token);
            System.out.println("Token expirado y eliminado.");
            return "expired";
        }

        // Si el token es válido, habilita al usuario cambiando su estado a activo.
        user.setEnabled(true);
        try {
            // Guarda los cambios en el usuario en el repositorio.
            userRepo.save(user);
            System.out.println("Usuario actualizado. Nuevo estado: " + user.isEnabled());
            // Elimina el token usado después de completar la verificación.
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