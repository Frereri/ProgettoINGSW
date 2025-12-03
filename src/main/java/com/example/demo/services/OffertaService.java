package com.example.demo.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.demo.models.Offerta;

public class OffertaService {

    private List<Offerta> offerte = new ArrayList<>();
    private long nextId = 1;

    public List<Offerta> getOfferte() {
        return offerte;
    }

    public Offerta getOffertaById(Long id) {
        for (Offerta o : offerte) {
            if (o.getIdOfferta().equals(id)) return o;
        }
        throw new RuntimeException("Offerta non trovata");
    }

    public Offerta creaOfferta(Offerta offerta) {
        offerta.setIdOfferta(nextId++);
        offerta.setDataOfferta(LocalDate.now());
        offerta.setStato("IN_ATTESA");
        offerta.addStoricoOfferta(offerta.getPrezzoProposto());
        offerte.add(offerta);
        return offerta;
    }

    public Offerta aggiornaOfferta(Long id, Offerta updated) {

        Offerta o = getOffertaById(id);

        if (updated.getPrezzoProposto() != o.getPrezzoProposto()) {
            o.setPrezzoProposto(updated.getPrezzoProposto());
            o.addStoricoOfferta(updated.getPrezzoProposto());
        }

        if (updated.getControfferta() != null) {
            o.setControfferta(updated.getControfferta());
            o.addStoricoOfferta(updated.getControfferta());
        }

        o.setStato(updated.getStato());

        return o;
    }

    public void eliminaOfferta(Long id) {
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
