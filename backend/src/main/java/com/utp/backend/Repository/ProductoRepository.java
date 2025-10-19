package com.utp.backend.Repository;

import com.utp.backend.Model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository  extends JpaRepository <Producto, Long>{
}