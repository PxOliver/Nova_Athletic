package com.utp.backend.Service.Auth;

import com.utp.backend.Model.Usuario;

public interface UsuarioService {

    Usuario obtenerUsuarioPorUsername(String username);
    Usuario actualizarUsuario(Usuario usuario);
    
}