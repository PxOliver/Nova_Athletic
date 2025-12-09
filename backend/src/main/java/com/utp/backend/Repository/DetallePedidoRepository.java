package com.utp.backend.Repository;

import com.utp.backend.Model.Detallepedido;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetallePedidoRepository extends JpaRepository<Detallepedido, Long> {
    List<Detallepedido> findByPedidoId(Long pedidoId);
}