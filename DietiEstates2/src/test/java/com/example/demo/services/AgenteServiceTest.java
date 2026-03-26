package com.example.demo.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.models.Agente;
import com.example.demo.models.Appartamento;
import com.example.demo.models.Offerta;
import com.example.demo.models.StoricoOfferta;
import com.example.demo.repositories.AgenteRepo;
import com.example.demo.repositories.ImmobileRepo;
import com.example.demo.repositories.OffertaRepo;
import com.example.demo.repositories.StoricoRepo;
import com.example.demo.dto.ImmobileDTO;
import com.example.demo.dto.OffertaDTO;
import com.example.demo.mapper.IImmobileMapper;
import com.example.demo.mapper.IOffertaMapper;
import com.example.demo.mapper.IStoricoOffertaMapper;

@ExtendWith(MockitoExtension.class)
class AgenteServiceTest {

    @Mock
    private OffertaRepo offertaRepo;
    @Mock
    private StoricoRepo storicoRepo;
    @Mock
    private IOffertaMapper offertaMapper;
    @Mock
    private IStoricoOffertaMapper storicoMapper;
    
    @Mock
    private AgenteRepo agenteRepo;
    @Mock
    private ImmobileRepo immobileRepo;
    @Mock
    private IImmobileMapper immobileMapper;
    @Mock
    private GeoService geoService;
    
    @InjectMocks
    private AgenteService agenteService;

    @Test
    @DisplayName("Metodo 1: gestisciOfferta - Successo")
    void testGestisciOffertaSuccesso() {
        Integer idOfferta = 1;
        UUID idAgente = UUID.randomUUID();
        
        Agente agente = new Agente();
        agente.setIdUtente(idAgente);

        Appartamento immobile = new Appartamento();
        immobile.setAgente(agente);

        Offerta offerta = new Offerta();
        offerta.setImmobile(immobile);
        offerta.setStato("IN_ATTESA");

        when(offertaRepo.findById(idOfferta)).thenReturn(Optional.of(offerta));
        when(offertaRepo.save(any(Offerta.class))).thenReturn(offerta);
        when(storicoMapper.createLog(any(), any(), any())).thenReturn(new StoricoOfferta());

        assertDoesNotThrow(() -> 
            agenteService.gestisciOfferta(idOfferta, "ACCETTATA", null, "Nota", idAgente)
        );

        assertEquals("ACCETTATA", offerta.getStato());
    }
    
    @Test
    @DisplayName("Metodo 2: caricaImmobile - Errore Indirizzo Non Valido")
    void testCaricaImmobileIndirizzoErrato() {
        UUID idAgente = UUID.randomUUID();
        ImmobileDTO dto = new ImmobileDTO();
        dto.setIndirizzo("Via Inesistente 999");
        dto.setTipoImmobile("APPARTAMENTO");

        when(agenteRepo.findById(idAgente)).thenReturn(Optional.of(new Agente()));
        when(immobileMapper.immobileDTOtoAppartamento(dto)).thenReturn(new Appartamento());
        
        when(geoService.getCoordinates(anyString())).thenReturn(null);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> 
            agenteService.caricaImmobile(dto, idAgente)
        );
        
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        verify(immobileRepo, never()).save(any());
    }
    
    @Test
    @DisplayName("Metodo 3: inserisciOffertaEsterna - Successo")
    void testInserisciOffertaEsternaSuccesso() {
        Integer idImmobile = 50;
        OffertaDTO dto = new OffertaDTO();
        dto.setPrezzoOfferto(200000.0);

        Appartamento immobile = new Appartamento();
        immobile.setPrezzo(210000.0);

        when(immobileRepo.findById(idImmobile)).thenReturn(Optional.of(immobile));
        when(offertaMapper.dtoToOfferta(dto)).thenReturn(new Offerta());
        when(offertaRepo.save(any(Offerta.class))).thenAnswer(i -> i.getArguments()[0]);
        when(offertaMapper.offertaToDTO(any())).thenReturn(dto);

        OffertaDTO risultato = agenteService.inserisciOffertaEsterna(dto, idImmobile);

        assertNotNull(risultato);
        verify(offertaRepo).save(argThat(Offerta::isOffertaEsterna));
    }

    @Test
    @DisplayName("Metodo 4: getProfiloAgente - Errore Agente Non Trovato")
    void testGetProfiloAgenteNotFound() {
        UUID idAgente = UUID.randomUUID();
        
        when(agenteRepo.findById(idAgente)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> 
            agenteService.getProfiloAgente(idAgente)
        );

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }
}
