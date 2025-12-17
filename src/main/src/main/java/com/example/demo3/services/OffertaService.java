package com.example.demo3.services;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.demo3.models.Offerta;


public class OffertaService {

    private List<Offerta> offerte = new ArrayList<>();

  
    public List<Offerta> getOfferte() {
        return offerte;
    }

    public Offerta getOffertaById(Integer id) {
        for (int i = 0; i < offerte.size(); i++) {
        	if(offerte.get(i).getIdOfferta().equals(id))
        		return offerte.get(i);
        }
        throw new RuntimeException("Offerta non trovata");
    }

    public Offerta creaOfferta(Offerta offerta) {
        offerta.setIdOfferta(offerte.size()+1);
        offerta.setDataOfferta(LocalDate.now());
        offerta.setStato("IN_ATTESA");
        offerte.add(offerta);
        return offerta;
    }

    public Offerta aggiornaOfferta(Integer id, Offerta updated) {

        Offerta o = getOffertaById(id);

        if (updated.getPrezzoProposto() != o.getPrezzoProposto()) {
            o.setPrezzoProposto(updated.getPrezzoProposto());
        }

        if (updated.getControfferta() != null) {
            o.setControfferta(updated.getControfferta());
        }

        o.setStato(updated.getStato());

        return o;
    }

    public void eliminaOfferta(Integer id) {
        Offerta o = getOffertaById(id);
        offerte.remove(o);
    }

    public List<Offerta> cercaOfferte(
            Long idImmobile,
            Long idCliente,
            Double importoMin,
            Double importoMax,
            String stato
    ) {
        List<Offerta> risultati = new ArrayList<>();

        for (Offerta o : offerte) {

            if (importoMin != null && o.getPrezzoProposto() < importoMin) continue;
            if (importoMax != null && o.getPrezzoProposto() > importoMax) continue;
            if (stato != null && !o.getStato().equalsIgnoreCase(stato)) continue;

            risultati.add(o);
        }

        return risultati;
    }
}