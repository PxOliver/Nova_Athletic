package com.utp.backend.Controller;

// Define un registro (record) llamado AuthResponseDto.
// Este record representa la respuesta que se envía al cliente después de un intento de autenticación o registro.
public record AuthResponseDto(
        String token,
        String rol,
        AuthStatus authStatus,
        String message) {
}