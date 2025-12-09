package com.utp.backend.Controller;

public record DireccionEnvioDto(
    String direccion,
    String ciudad,
    String departamento,
    String codigoPostal
) {}