package com.example.demo.config;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AbstractAuthenticationToken;
//import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.repositories.UtenteRepo;



@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
//	            .requestMatchers("/api/gestore/**").hasAuthority("GESTORE")
//	            .requestMatchers("/api/agente/**").hasAuthority("AGENTE")
//	            .requestMatchers("/api/cliente/**").hasAuthority("CLIENTE")
//	            .requestMatchers("/api/amministratore/**").hasAuthority("AMMINISTRATORE")
////	            .requestMatchers("/api/supporto-amministratore/**").hasAuthority("SUPPORTO_AMMINISTRATORE")
//	            .requestMatchers("/api/utente/**").authenticated()

	@Bean
    SecurityFilterChain filterChain(HttpSecurity http, UtenteRepo utenteRepo) throws Exception {
        http
        	.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
        		.requestMatchers("/api/immobile/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .requestMatchers("/api/agente/**").hasAuthority("AGENTE")
                .requestMatchers("/api/admin/**").hasAuthority("AMMINISTRATORE")
                .requestMatchers("/api/cliente/**").hasAuthority("CLIENTE")
                .anyRequest().authenticated()
            )
            
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(customJwtAuthenticationConverter(utenteRepo)))
            );
        
        return http.build();
    }

	@Bean
    Converter<Jwt, AbstractAuthenticationToken> customJwtAuthenticationConverter(UtenteRepo utenteRepo) {
        return jwt -> {
            // 1. Estraiamo il 'sub' (UUID di Cognito)
            String cognitoSub = jwt.getClaimAsString("sub");
            
            // 2. Cerchiamo l'utente nel DB usando il sub
            // Assicurati che nel DB l'ID sia un UUID
            return utenteRepo.findById(UUID.fromString(cognitoSub))
                .map(utente -> {
                    // 3. Prendiamo il ruolo dal DB (es. "AGENTE")
                    // Se il tuo ruolo nel DB è un Enum, usa utente.getRuolo().name()
                    List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(utente.getRuolo().toString()));
                    
                    return new JwtAuthenticationToken(jwt, authorities);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato nel database"));
        };       
    }
	
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
	    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	    configuration.setAllowedHeaders(Arrays.asList("*"));
	    configuration.setAllowCredentials(true);
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration);
	    return source;
	}
}
