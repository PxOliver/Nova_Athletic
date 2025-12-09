package com.utp.backend.Controller;

public record AuthResponseDto(
        String token,
        String rol,
        AuthStatus authStatus,
        String message) {
}