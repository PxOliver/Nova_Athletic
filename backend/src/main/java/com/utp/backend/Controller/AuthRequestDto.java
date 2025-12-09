package com.utp.backend.Controller;

public record AuthRequestDto(
        String nombre,
        String username,
        String password,
        String email) {
}