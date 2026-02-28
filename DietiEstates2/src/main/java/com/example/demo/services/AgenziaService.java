package com.example.demo.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.DTO.AgenziaDTO;
import com.example.demo.mapper.IAgenziaMapper;
import com.example.demo.models.Agenzia;
import com.example.demo.repositories.AgenziaRepo;

import jakarta.transaction.Transactional;

@Service
public class AgenziaService {

	@Autowired
    private AgenziaRepo agenziaRepo;

    @Autowired
    private IAgenziaMapper agenziaMapper;

    @Transactional
    public List<AgenziaDTO> findAll() {
        return agenziaRepo.findAll().stream()
                .map(agenziaMapper::agenziaToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AgenziaDTO findById(Integer id) {
        Agenzia agenzia = agenziaRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agenzia non trovata"));
        return agenziaMapper.agenziaToDTO(agenzia);
    }

    @Transactional
    public AgenziaDTO save(AgenziaDTO dto) {
        if (agenziaRepo.existsByPartitaIva(dto.getPartitaIva())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Partita IVA già presente nel sistema");
        }

        Agenzia agenzia = agenziaMapper.dtoToAgenzia(dto);
        Agenzia salvata = agenziaRepo.save(agenzia);
        return agenziaMapper.agenziaToDTO(salvata);
    }

    @Transactional
    public void delete(Integer id) {
    	Agenzia agenzia = agenziaRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agenzia non trovata"));
        
        if (agenzia.getAgenti() != null && !agenzia.getAgenti().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossibile eliminare un'agenzia con agenti attivi");
        }
        
        agenziaRepo.delete(agenzia);
    }
}
