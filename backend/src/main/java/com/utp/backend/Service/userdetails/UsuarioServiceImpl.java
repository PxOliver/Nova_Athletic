package com.utp.backend.Service.userdetails;

import com.utp.backend.Model.Usuario;
import com.utp.backend.Repository.UserRepo;
import com.utp.backend.Service.Auth.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public Usuario obtenerUsuarioPorUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public Usuario actualizarUsuario(Usuario usuario) {
        return userRepo.save(usuario);
    }
}