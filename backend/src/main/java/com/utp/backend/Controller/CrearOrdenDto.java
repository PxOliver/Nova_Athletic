package com.utp.backend.Controller;

import java.math.BigDecimal;
import java.util.List;

public record CrearOrdenDto(
    Long usuarioId,           
    List<OrdenItemDto> items,
    DireccionEnvioDto direccionEnvio,
    String metodoPago,
    BigDecimal subtotal,
    BigDecimal costoEnvio,
    BigDecimal total,
    String estado
) {}