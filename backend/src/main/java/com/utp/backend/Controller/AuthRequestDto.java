package com.utp.backend.Controller;
// Define un registro (record) llamado AuthRequestDto.
// Los records son una característica de Java que permite crear clases inmutables con menos código boilerplate.
// Este registro representa una solicitud de autenticación o registro de usuario.
public record AuthRequestDto(
        String nombre,
        String username,
        String password,
        String email) {
}