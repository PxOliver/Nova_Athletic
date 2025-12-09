package com.utp.backend.Controller;

import java.math.BigDecimal;

public record OrdenItemDto(
    Long productoId,
    Integer cantidad,
    BigDecimal precioUnitario
) {}
