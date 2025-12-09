package com.utp.backend.Controller;

import java.math.BigDecimal;

public record OrdenItemDetalleDto(
    Long productoId,
    String productoNombre,
    Integer cantidad,
    BigDecimal precioUnitario
) {}