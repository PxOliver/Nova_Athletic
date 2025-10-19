package com.utp.backend.Controller;

import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/secret")
public class SecretController {

    @GetMapping("/")
    public ResponseEntity<String> getSecret() {
        return ResponseEntity
                .status(HttpStatus.OK)  
                .body(UUID.randomUUID().toString());  
    }
}