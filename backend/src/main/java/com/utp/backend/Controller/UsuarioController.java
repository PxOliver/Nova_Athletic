package com.utp.backend.Controller;

import com.utp.backend.Model.Usuario;
import com.utp.backend.Service.Auth.UsuarioService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<?> getPerfilUsuario(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Usuario no autenticado");
            }

            String username = userDetails.getUsername();
            Usuario usuario = usuarioService.obtenerUsuarioPorUsername(username);

            if (usuario == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado");
            }

            return ResponseEntity.ok(usuario);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener el perfil: " + e.getMessage());
        }
    }

    @PutMapping("/perfil/actualizar")
    public ResponseEntity<?> actualizarPerfilUsuario(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Usuario usuarioActualizado) {

        try {
            if (userDetails == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Usuario no autenticado");
            }

            String username = userDetails.getUsername();
            Usuario usuario = usuarioService.obtenerUsuarioPorUsername(username);

            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado");
            }

            if (usuarioActualizado.getNombre() == null || usuarioActualizado.getNombre().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre es obligatorio");
            }

            if (usuarioActualizado.getEmail() == null || usuarioActualizado.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("El email es obligatorio");
            }

            usuario.setNombre(usuarioActualizado.getNombre());
            usuario.setEmail(usuarioActualizado.getEmail());
            usuario.setTelefono(usuarioActualizado.getTelefono());
            usuario.setPais(usuarioActualizado.getPais());

            Usuario usuarioActualizadoDB = usuarioService.actualizarUsuario(usuario);

            return ResponseEntity.ok(usuarioActualizadoDB);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el perfil: " + e.getMessage());
        }
    }

    @PutMapping("/perfil/actualizar/imagen")
    public ResponseEntity<?> actualizarImagenPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("imagen") MultipartFile imagen) {

        try {
            if (userDetails == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Usuario no autenticado");
            }

            String username = userDetails.getUsername();
            Usuario usuario = usuarioService.obtenerUsuarioPorUsername(username);

            if (usuario == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado");
            }

            String imageUrl = uploadImage(imagen);
            usuario.setImagenUrl(imageUrl);
            Usuario usuarioActualizadoDB = usuarioService.actualizarUsuario(usuario);

            return ResponseEntity.ok(usuarioActualizadoDB);

        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir la imagen: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la imagen de perfil: " + e.getMessage());
        }
    }

    private String uploadImage(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get("uploads/");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString();

        String extension = "";
        if (originalFilename != null) {
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                extension = originalFilename.substring(dotIndex);
            }
        }
        if (extension.isEmpty()) {
            extension = ".jpg";
        }

        fileName += extension;
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Ruta pública que servirás desde tu controlador de uploads
        return "/api/uploads/" + fileName;
    }
}