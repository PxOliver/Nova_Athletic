package com.utp.backend.Controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrdenResponseDto(
    Long id,
    LocalDateTime fechaCreacion,
    String estado,
    DireccionEnvioDto direccionEnvio,
    String metodoPago,
    BigDecimal subtotal,
    BigDecimal costoEnvio,
    BigDecimal total,
    List<OrdenItemDetalleDto> items
) {}