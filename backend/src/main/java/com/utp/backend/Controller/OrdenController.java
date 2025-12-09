package com.utp.backend.Controller;

import com.utp.backend.Model.Pedido;
import com.utp.backend.Model.Detallepedido;
import com.utp.backend.Model.Producto;
import com.utp.backend.Model.Usuario;

import com.utp.backend.Repository.PedidoRepository;
import com.utp.backend.Repository.DetallePedidoRepository;
import com.utp.backend.Repository.ProductoRepository;

import com.utp.backend.Service.Auth.AuthService;
import com.utp.backend.Util.JwtUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private AuthService authService;

    // ================== CREAR ORDEN ==================
    @PostMapping
    public ResponseEntity<?> crearOrden(
            @RequestBody CrearOrdenDto request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        try {

            if (authorizationHeader == null || authorizationHeader.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Falta Authorization");
            }

            // Obtener token sin "Bearer "
            String token = authorizationHeader.replace("Bearer ", "").trim();

            // → MÉTODO ESTÁTICO COMO EN TU JWTUTILS
            String username = JwtUtils.getUsernameFromToken(token)
                    .orElseThrow(() -> new RuntimeException("Token inválido"));

            Usuario usuario = authService.findByUsername(username);

            // Crear pedido
            Pedido pedido = new Pedido();
            pedido.setUsuario(usuario);
            pedido.setFecha(LocalDateTime.now());
            pedido.setSubtotal(request.subtotal());
            pedido.setCostoEnvio(request.costoEnvio());
            pedido.setTotal(request.total());
            pedido.setEstado(request.estado());

            if (request.direccionEnvio() != null) {
                pedido.setDireccion(request.direccionEnvio().direccion());
                pedido.setCiudad(request.direccionEnvio().ciudad());
                pedido.setDepartamento(request.direccionEnvio().departamento());
                pedido.setCodigoPostal(request.direccionEnvio().codigoPostal());
            }

            pedidoRepository.save(pedido);

            // Procesar detalles
            List<Detallepedido> detalles = new ArrayList<>();

            for (OrdenItemDto item : request.items()) {

                Producto producto = productoRepository.findById(item.productoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

                Detallepedido detalle = new Detallepedido();
                detalle.setPedido(pedido);
                detalle.setProducto(producto);
                detalle.setCantidad(item.cantidad());

                BigDecimal subtotalItem = item.precioUnitario()
                        .multiply(BigDecimal.valueOf(item.cantidad()));

                detalle.setSubtotal(subtotalItem);

                detalles.add(detallePedidoRepository.save(detalle));
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(mapearPedidoADto(pedido, detalles, request.metodoPago()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    // ================== OBTENER ORDEN POR ID (PÚBLICO) ==================
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerOrden(@PathVariable Long id) {

        var pedidoOptional = pedidoRepository.findById(id);

        if (!pedidoOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Orden no encontrada");
        }

        Pedido pedido = pedidoOptional.get();
        List<Detallepedido> detalles = detallePedidoRepository.findByPedidoId(id);

        OrdenResponseDto dto = mapearPedidoADto(pedido, detalles, "desconocido");

        return ResponseEntity.ok(dto);
    }

    // ================== MAPPER ==================
    private OrdenResponseDto mapearPedidoADto(Pedido pedido, List<Detallepedido> detalles, String metodoPago) {

        List<OrdenItemDetalleDto> itemsDto = detalles.stream()
                .map(det -> new OrdenItemDetalleDto(
                        det.getProducto().getId(),
                        det.getProducto().getNombre(),
                        det.getCantidad(),
                        det.getProducto().getPrecio()
                ))
                .toList();

        DireccionEnvioDto dirDto = new DireccionEnvioDto(
                pedido.getDireccion(),
                pedido.getCiudad(),
                pedido.getDepartamento(),
                pedido.getCodigoPostal()
        );

        return new OrdenResponseDto(
                pedido.getId(),
                pedido.getFecha(),
                pedido.getEstado(),
                dirDto,
                metodoPago,
                pedido.getSubtotal(),
                pedido.getCostoEnvio(),
                pedido.getTotal(),
                itemsDto
        );
    }
}