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

                        // PÚBLICO
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()

                        // USUARIO AUTENTICADO
                        .requestMatchers(HttpMethod.GET, "/api/ordenes/usuario").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/ordenes").authenticated()

                        // ==== ADMIN PRODUCTOS ====
                        .requestMatchers(HttpMethod.POST, "/api/productos/crear").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/productos/actualizar/**").hasRole("ADMIN")

                        // ==== ADMIN ÓRDENES ====
                        .requestMatchers(HttpMethod.GET, "/api/ordenes").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/ordenes/*/estado").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/ordenes/admin").hasRole("ADMIN")

                        // ORDEN POR ID (público)
                        .requestMatchers(HttpMethod.GET, "/api/ordenes/*").permitAll()

                        // RESTO
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                frontendUrl));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}