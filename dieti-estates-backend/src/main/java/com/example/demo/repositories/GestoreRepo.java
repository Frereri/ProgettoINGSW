package com.example.demo.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Gestore;

public interface GestoreRepo extends JpaRepository<Gestore, UUID> {
    
	boolean existsByAgenziaIdAgenzia(Integer idAgenzia);
}
