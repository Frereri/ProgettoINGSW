package com.example.demo.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.DTO.CreazioneStaffDTO;
import com.example.demo.DTO.RegistrazioneClienteDTO;
import com.example.demo.DTO.UtenteDTO;
import com.example.demo.mapper.IUtenteMapper;
import com.example.demo.models.Cliente;
import com.example.demo.models.Utente;
import com.example.demo.repositories.UtenteRepo;

@Service
public class UtenteService {

	@Autowired
    private UtenteRepo utenteRepo;

    @Autowired
    private IUtenteMapper utenteMapper;
    
    @Autowired
    private AuthService authService;

    public List<UtenteDTO> findAll() {
        return utenteRepo.findAll().stream()
                .map(utenteMapper::toDTO)
                .collect(Collectors.toList());
    }

    public UtenteDTO findById(UUID id) {
        Utente utente = utenteRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato"));
        return utenteMapper.toDTO(utente);
    }

    public boolean existsByEmail(String email) {
        return utenteRepo.existsByEmail(email);
    }

    public void delete(UUID id) {
        if (!utenteRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Impossibile eliminare: utente non trovato");
        }
        utenteRepo.deleteById(id);
    }
    
    public UtenteDTO registraCliente(RegistrazioneClienteDTO request) {
        if (existsByEmail(request.getDatiProfilo().getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email già presente");
        }
        String cognitoSub = authService.signUp(request.getDatiProfilo().getEmail(), request.getPassword());
        authService.confirmUser(request.getDatiProfilo().getEmail());
        Cliente cliente = utenteMapper.toEntityFromRegister(request);
        cliente.setIdUtente(UUID.fromString(cognitoSub));   
        return utenteMapper.toDTO(utenteRepo.save(cliente));
    }

    public UtenteDTO creaStaff(CreazioneStaffDTO request) {
        if (existsByEmail(request.getDatiProfilo().getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email già presente");
        }

        String cognitoSub = authService.adminCreateUser(request.getDatiProfilo().getEmail());

        Utente staff = utenteMapper.toEntity(request.getDatiProfilo());
        staff.setIdUtente(UUID.fromString(cognitoSub));
        
        return utenteMapper.toDTO(utenteRepo.save(staff));
    }
}
