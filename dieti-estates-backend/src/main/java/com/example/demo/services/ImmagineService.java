package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.DTO.ImmobileImmagineDTO;
import com.example.demo.mapper.IImmobileImmagineMapper;
import com.example.demo.models.Immobile;
import com.example.demo.models.ImmobileImmagine;
import com.example.demo.repositories.ImmobileImmagineRepo;
import com.example.demo.repositories.ImmobileRepo;

@Service
public class ImmagineService {
	
    @Autowired
    private ImmobileImmagineRepo immagineRepo;

    @Autowired
    private ImmobileRepo immobileRepo;

    @Autowired
    private IImmobileImmagineMapper immagineMapper;

    public ImmobileImmagineDTO aggiungiImmagine(Integer idImmobile, String url, boolean copertina) {
        Immobile immobile = immobileRepo.findById(idImmobile)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Immobile non trovato"));

        if (copertina) {
            List<ImmobileImmagine> attuali = immagineRepo.findByImmobileIdImmobile(idImmobile);
            attuali.forEach(img -> img.setCopertina(false));
            immagineRepo.saveAll(attuali);
        }

        ImmobileImmagine nuovaImg = new ImmobileImmagine();
        nuovaImg.setImmobile(immobile);
        nuovaImg.setUrlImmagine(url);
        nuovaImg.setCopertina(copertina);

        return immagineMapper.toDTO(immagineRepo.save(nuovaImg));
    }

    public void eliminaImmagine(Integer idImmagine) {
    	if (!immagineRepo.existsById(idImmagine)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Immagine non trovata");
        }
    	immagineRepo.deleteById(idImmagine);
    }
}
