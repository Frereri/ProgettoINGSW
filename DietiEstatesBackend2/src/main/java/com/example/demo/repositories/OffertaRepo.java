package com.example.demo.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Cliente;
import com.example.demo.models.Offerta;

public interface OffertaRepo extends JpaRepository<Offerta, Integer>{

	List<Offerta> findByCliente_IdUtente(UUID idCliente);

    List<Offerta> findByImmobile_IdImmobile(Integer idImmobile);

    List<Offerta> findByImmobile_Agente_IdUtente(UUID idAgente);
    
    List<Offerta> findByClienteAndOffertaEsternaFalse(Cliente cliente);
    
	List<Offerta> findByCliente(Cliente cliente);

	List<Offerta> findByImmobile_Agente_IdUtenteAndStatoIn(UUID idAgente, List<String> stati);
	
	List<Offerta> findByImmobile_Agente_IdUtenteAndStato(UUID idAgente, String stato);
	
	
}
