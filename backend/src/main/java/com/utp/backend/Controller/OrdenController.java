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

    // ========== CREAR ORDEN ========== 
    @PostMapping
    public ResponseEntity<OrdenResponseDto> crearOrden(
            @RequestBody CrearOrdenDto request,
            @RequestHeader("Authorization") String authorizationHeader) {

        try {
            // 1. Obtener usuario desde el token
            String token = authorizationHeader.replace("Bearer ", "").trim();

            String username = JwtUtils.getUsernameFromToken(token)
                    .orElseThrow(() -> new RuntimeException("Token inválido"));

            Usuario usuario = authService.findByUsername(username);

            // 2. Crear pedido
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

            pedido = pedidoRepository.save(pedido);

            // 3. Crear detalles
            List<Detallepedido> detalles = new ArrayList<>();

            for (OrdenItemDto item : request.items()) {
                Producto producto = productoRepository.findById(item.productoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

                Detallepedido detalle = new Detallepedido();
                detalle.setPedido(pedido);
                detalle.setProducto(producto);
                detalle.setCantidad(item.cantidad());

                BigDecimal subtotalItem =
                        item.precioUnitario().multiply(BigDecimal.valueOf(item.cantidad()));
                detalle.setSubtotal(subtotalItem);

                detalles.add(detallePedidoRepository.save(detalle));
            }

            OrdenResponseDto responseDto = mapearPedidoADto(pedido, detalles, request.metodoPago());

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // ========== OBTENER ORDEN POR ID ==========
    @GetMapping("/{id}")
    public ResponseEntity<OrdenResponseDto> obtenerOrden(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .map(pedido -> {
                    List<Detallepedido> detalles = detallePedidoRepository.findByPedidoId(id);
                    String metodoPago = "desconocido";
                    OrdenResponseDto dto = mapearPedidoADto(pedido, detalles, metodoPago);
                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ========== OBTENER TODAS LAS ÓRDENES (ADMIN) ==========
    @GetMapping
    public ResponseEntity<List<OrdenResponseDto>> obtenerTodasLasOrdenes() {

        List<Pedido> pedidos = pedidoRepository.findAll();
        List<OrdenResponseDto> respuesta = new ArrayList<>();

        for (Pedido pedido : pedidos) {
            List<Detallepedido> detalles = detallePedidoRepository.findByPedidoId(pedido.getId());
            respuesta.add(mapearPedidoADto(pedido, detalles, "desconocido"));
        }

        return ResponseEntity.ok(respuesta);
    }

    // ========== OBTENER ÓRDENES DEL USUARIO LOGUEADO ==========
    @GetMapping("/usuario")
    public ResponseEntity<List<OrdenResponseDto>> obtenerOrdenesUsuario(
            @RequestHeader("Authorization") String authHeader) {

        try {
            String token = authHeader.replace("Bearer ", "").trim();

            String username = JwtUtils.getUsernameFromToken(token)
                    .orElseThrow(() -> new RuntimeException("Token inválido"));

            Usuario usuario = authService.findByUsername(username);

            List<Pedido> pedidos = pedidoRepository.findByUsuarioId(usuario.getId());
            List<OrdenResponseDto> respuesta = new ArrayList<>();

            for (Pedido pedido : pedidos) {
                List<Detallepedido> detalles = detallePedidoRepository.findByPedidoId(pedido.getId());
                respuesta.add(mapearPedidoADto(pedido, detalles, "desconocido"));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // ========== ACTUALIZAR ESTADO DE ORDEN (ADMIN) ==========
    @PutMapping("/{id}/estado")
    public ResponseEntity<OrdenResponseDto> actualizarEstadoOrden(
            @PathVariable Long id,
            @RequestBody ActualizarEstadoOrdenDto request) {

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setEstado(request.estado());
        pedido = pedidoRepository.save(pedido);

        List<Detallepedido> detalles = detallePedidoRepository.findByPedidoId(id);

        OrdenResponseDto dto = mapearPedidoADto(pedido, detalles, "desconocido");
        return ResponseEntity.ok(dto);
    }

    // ========== MAPEOS AUXILIARES ==========
    private OrdenResponseDto mapearPedidoADto(Pedido pedido,
                                              List<Detallepedido> detalles,
                                              String metodoPago) {

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