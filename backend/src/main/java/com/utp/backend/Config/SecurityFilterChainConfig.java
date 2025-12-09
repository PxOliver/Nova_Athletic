package com.utp.backend.Config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityFilterChainConfig {

    private final JWTAuthenticationFilter jwtFilter;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public SecurityFilterChainConfig(JWTAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                    // ---------- PÚBLICO ----------
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/productos/**").permitAll()
                    .requestMatchers("/api/uploads/**").permitAll()
                    // Detalle de orden por id (página de agradecimiento / orden/:id)
                    .requestMatchers(HttpMethod.GET, "/api/ordenes/*").permitAll()

                    // ---------- USUARIO AUTENTICADO ----------
                    // Crear orden (checkout)
                    .requestMatchers(HttpMethod.POST, "/api/ordenes").authenticated()
                    // Órdenes del usuario logueado (/mis-ordenes)
                    .requestMatchers(HttpMethod.GET, "/api/ordenes/usuario").authenticated()

                    // ---------- ADMIN ----------
                    // Listado de todas las órdenes (AdminDashboard)
                    .requestMatchers(HttpMethod.GET, "/api/ordenes").hasRole("ADMIN")
                    // Actualizar estado de orden (AdminDashboard)
                    .requestMatchers(HttpMethod.PUT, "/api/ordenes/*/estado").hasRole("ADMIN")

                    // ---------- CUALQUIER OTRO ENDPOINT ----------
                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                frontendUrl
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}