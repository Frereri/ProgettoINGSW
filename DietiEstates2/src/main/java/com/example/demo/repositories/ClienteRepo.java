package com.example.demo.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Cliente;

public interface ClienteRepo extends JpaRepository<Cliente, UUID>{

	Optional<Cliente> findByEmail(String email);

}
