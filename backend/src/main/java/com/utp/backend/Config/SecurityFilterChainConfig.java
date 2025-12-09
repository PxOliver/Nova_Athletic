package com.utp.backend.Config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityFilterChainConfig {

        private final AuthenticationEntryPoint authenticationEntryPoint;
        private final JWTAuthenticationFilter jwtAuthenticationFilter;

        // URL del frontend (Render) con fallback a localhost
        @Value("${FRONTEND_URL:http://localhost:3000}")
        private String frontendUrl;

        public SecurityFilterChainConfig(AuthenticationEntryPoint authenticationEntryPoint,
                        JWTAuthenticationFilter jwtAuthenticationFilter) {
                this.authenticationEntryPoint = authenticationEntryPoint;
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
                httpSecurity
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(AbstractHttpConfigurer::disable);

                httpSecurity.authorizeHttpRequests(
                                requestMatcher -> requestMatcher
                                                .requestMatchers("/api/auth/login/**").permitAll()
                                                .requestMatchers("/api/auth/registrar/**").permitAll()
                                                .requestMatchers("/api/auth/verifyEmail/**").permitAll()
                                                .requestMatchers("/api/productos/**").permitAll()
                                                .requestMatchers("/api/productos/crear/**").permitAll()
                                                .requestMatchers("/api/productos/actualizar/**").permitAll()
                                                .requestMatchers("/api/uploads/**").permitAll()
                                                .anyRequest().authenticated())
                                .exceptionHandling(
                                                exceptionConfig -> exceptionConfig
                                                                .authenticationEntryPoint(authenticationEntryPoint))
                                .sessionManagement(
                                                sessionConfig -> sessionConfig
                                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return httpSecurity.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(Arrays.asList(
                                "http://localhost:3000", // desarrollo
                                "https://nova-athletic-1.onrender.com" // frontend en Render
                ));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}