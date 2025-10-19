package com.utp.backend.Repository;

import com.utp.backend.Model.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface UserRepo extends JpaRepository<Usuario, Long> {

   boolean existsByUsername(String username);
   Optional<Usuario> findByUsername(String username);
   boolean existsByEmail(String email);
   Optional<Usuario> findByEmail(String email);

}