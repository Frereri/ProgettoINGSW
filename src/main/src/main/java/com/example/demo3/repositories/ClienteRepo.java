package com.example.demo3.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo3.models.Cliente;

@Repository
public interface ClienteRepo extends JpaRepository<Cliente, Integer>{

}
