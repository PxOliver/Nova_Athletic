package com.utp.backend.Controller;

import com.utp.backend.Model.Usuario;
import com.utp.backend.Service.Auth.UsuarioService;

import java.io.IOException;
import java.nio.file.*;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<?> getPerfilUsuario(@AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");

        Usuario usuario = usuarioService.obtenerUsuarioPorUsername(userDetails.getUsername());

        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/perfil/actualizar")
    public ResponseEntity<?> actualizar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Usuario data) {

        if (userDetails == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");

        Usuario usuario = usuarioService.obtenerUsuarioPorUsername(userDetails.getUsername());

        usuario.setNombre(data.getNombre());
        usuario.setEmail(data.getEmail());
        usuario.setTelefono(data.getTelefono());
        usuario.setPais(data.getPais());

        return ResponseEntity.ok(usuarioService.actualizarUsuario(usuario));
    }

    @PutMapping("/perfil/actualizar/imagen")
    public ResponseEntity<?> actualizarImagen(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("imagen") MultipartFile imagen) throws IOException {

        if (userDetails == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");

        Usuario usuario = usuarioService.obtenerUsuarioPorUsername(userDetails.getUsername());

        String url = saveImage(imagen);
        usuario.setImagenUrl(url);

        return ResponseEntity.ok(usuarioService.actualizarUsuario(usuario));
    }

    private String saveImage(MultipartFile file) throws IOException {

        Path uploadPath = Paths.get("uploads");
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String extension = file.getOriginalFilename().substring(
                file.getOriginalFilename().lastIndexOf("."));

        String filename = UUID.randomUUID() + extension;

        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/api/uploads/" + filename;
    }
}