package com.utp.backend.Controller;

import com.utp.backend.Service.Auth.AuthService;
import com.utp.backend.Service.Auth.AuthServiceImpl;
import com.utp.backend.token.VerificationToken;
import com.utp.backend.token.VerificationTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private AuthServiceImpl userService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody AuthRequestDto authRequestDto) {
        try {
            var jwtToken = authService.login(authRequestDto.username(), authRequestDto.password());

            var usuario = userService.findByUsername(authRequestDto.username());
            var authResponseDto = new AuthResponseDto(
                    jwtToken,
                    usuario.getRol(),
                    AuthStatus.LOGIN_SUCCESS,
                    "Inicio de sesion exitoso");

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(authResponseDto);

        } catch (Exception e) {
            String errorMessage = e.getMessage();
            AuthStatus status = AuthStatus.LOGIN_FAILED;

            if (errorMessage.contains("Usuario no encontrado")) {
                errorMessage = "Usuario no encontrado";
            } else if (errorMessage.contains("La cuenta no ha sido verificada")) {
                errorMessage = "La cuenta no ha sido verificada. Por favor, revise su correo electrónico.";
            } else if (errorMessage.contains("Bad credentials")) {
                errorMessage = "Usuario o contraseña incorrectos";
            }

            var authResponseDto = new AuthResponseDto(null, null, status, errorMessage);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(authResponseDto);
        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<AuthResponseDto> signUp(@RequestBody AuthRequestDto authRequestDto) {
        try {
            var jwtToken = authService.signUp(authRequestDto.nombre(), authRequestDto.username(),
                    authRequestDto.password(), authRequestDto.email());

            var authResponseDto = new AuthResponseDto(jwtToken, "USER",
                    AuthStatus.USER_CREATED_SUCCESSFULLY,
                    "Usuario creado con exito. Por favor, revise, tu correo electronico y verifica tu cuenta para completar el registro");

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(authResponseDto);

        } catch (Exception e) {
            String errorMessage = e.getMessage();
            AuthStatus status = AuthStatus.USER_NOT_CREATED;

            if (e.getMessage().contains("Username already exists")) {
                errorMessage = "El nombre de usuario ya está en uso";
            } else if (e.getMessage().contains("Email already exists")) {
                errorMessage = "El correo electrónico ya está registrado";
            }

            var authResponseDto = new AuthResponseDto(null, null, status, errorMessage);

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(authResponseDto);
        }
    }

    @GetMapping("/verifyEmail")
    public void verifyEmail(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        System.out.println("Recibida solicitud de verificación para token: " + token);

        try {
            VerificationToken theToken = tokenRepository.findByToken(token);

            if (theToken == null) {
                System.out.println("Token no encontrado");
                response.sendRedirect(frontendUrl + "/verification?status=invalid-token");
                return;
            }

            String result = userService.validateToken(token);
            System.out.println("Resultado de la validación: " + result);
            switch (result) {
                case "valido":
                    response.sendRedirect(frontendUrl + "/verification?status=success");
                    break;
                case "expired":
                    response.sendRedirect(frontendUrl + "/verification?status=expired");
                    break;
                default:
                    response.sendRedirect(frontendUrl + "/verification?status=invalid-token");
            }
        } catch (Exception e) {
            System.out.println("Error durante la verificación: " + e.getMessage());
            e.printStackTrace();
            response.sendRedirect(frontendUrl + "/verification?status=error");
        }
    }

    public String applicationUrl(HttpServletRequest request) {
        return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    }
}