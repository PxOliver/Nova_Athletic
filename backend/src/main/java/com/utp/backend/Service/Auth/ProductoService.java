package com.utp.backend.Service.Auth;

import com.utp.backend.Model.Producto;
import com.utp.backend.Repository.ProductoRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }
    
    public Optional<Producto> ObtenerPorId(Long id) {
        return productoRepository.findById(id);
    }
    
    public Producto guardarProducto(Producto producto){
        return productoRepository.save(producto);
    }
    
    public  void  eliminarProducto(Long id){
        productoRepository.deleteById(id);
    }
}