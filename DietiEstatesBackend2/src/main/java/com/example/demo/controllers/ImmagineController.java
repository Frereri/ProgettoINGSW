package com.example.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.ImmobileImmagineDTO;
import com.example.demo.services.ImmagineService;

@RestController
@RequestMapping("/api/immobile/immagine")
public class ImmagineController {

	private final ImmagineService immagineService;

    public ImmagineController(ImmagineService immagineService) {
		this.immagineService = immagineService;
	}

	@PostMapping("/{idImmobile}")
    public ResponseEntity<ImmobileImmagineDTO> upload(@PathVariable Integer idImmobile, 
                                                     @RequestParam String url, 
                                                     @RequestParam(defaultValue = "false") boolean copertina) {
        return ResponseEntity.ok(immagineService.aggiungiImmagine(idImmobile, url, copertina));
    }

    @DeleteMapping("/{idImmagine}")
    public ResponseEntity<Void> elimina(@PathVariable Integer idImmagine) {
        immagineService.eliminaImmagine(idImmagine);
        return ResponseEntity.noContent().build();
    }
}
