package com.example.demo.services;

import java.time.LocalDate;
import java.util.*;

import com.example.demo.models.Immobile;

public class ImmobileService {

    private List<Immobile> immobili = new ArrayList<Immobile>();
    private long nextId = 1;

    public List<Immobile> getImmobili() {
        return immobili;
    }

    public Immobile getImmobileById(Long id) {

        for (Immobile immobile : immobili) {
            if (immobile.getIdImmobile().equals(id)) {
                return immobile;
            }
        }
        throw new RuntimeException("Immobile non trovato");
    }

    public Immobile creaImmobile(Immobile immobile) {
        immobile.setIdImmobile(nextId++);
        immobile.setDataPubblicazione(LocalDate.now());
        immobili.add(immobile);
        return immobile;
    }

    public Immobile aggiornaImmobile(Long id, Immobile updated) {

        Immobile immobile = getImmobileById(id);

        immobile.setVia(updated.getVia());
        immobile.setNumeroCivico(updated.getNumeroCivico());
        immobile.setDescrizione(updated.getDescrizione());
        immobile.setPrezzo(updated.getPrezzo());
        immobile.setSuperficie(updated.getSuperficie());
        immobile.setNumeroBagni(updated.getNumeroBagni());
        immobile.setNumeroStanze(updated.getNumeroStanze());
        immobile.setCategoria(updated.getCategoria());
        immobile.setClasseEnergetica(updated.getClasseEnergetica());
        immobile.setLatitudine(updated.getLatitudine());
        immobile.setLongitudine(updated.getLongitudine());
        immobile.setCap(updated.getCap());
        immobile.setProvincia(updated.getProvincia());
        immobile.setEmailAgente(updated.getEmailAgente());
        immobile.setImmagine(updated.getImmagine());
        immobile.setNomeCitta(updated.getNomeCitta());
        immobile.setGarage(updated.isGarage());
        immobile.setClimatizzazione(updated.isClimatizzazione());
        immobile.setTerrazzo(updated.isTerrazzo());

        return immobile;
    }

    public void eliminaImmobile(Long id) {
        Immobile imm = getImmobileById(id);
        immobili.remove(imm);
    }
    
    public List<Immobile> cercaImmobili(
            String via,
            String numeroCivico,
            String descrizione,
            Double prezzoMin,
            Double prezzoMax,
            Integer superficieMin,
            Integer superficieMax,
            Integer numeroBagni,
            Integer numeroStanze,
            String categoria,
            String classeEnergetica,
            String nomeCitta,
            String provincia,
            String cap,
            Boolean garage,
            Boolean climatizzazione,
            Boolean terrazzo
    ) {
        List<Immobile> risultati = new ArrayList<>();

        for (Immobile i : immobili) {

            if (via != null && !i.getVia().equalsIgnoreCase(via)) continue;
            if (numeroCivico != null && !i.getNumeroCivico().equalsIgnoreCase(numeroCivico)) continue;

            if (descrizione != null && !i.getDescrizione().toLowerCase().contains(descrizione.toLowerCase()))
                continue;

            if (prezzoMin != null && i.getPrezzo() < prezzoMin) continue;
            if (prezzoMax != null && i.getPrezzo() > prezzoMax) continue;

            if (superficieMin != null && i.getSuperficie() < superficieMin) continue;
            if (superficieMax != null && i.getSuperficie() > superficieMax) continue;

            if (numeroBagni != null && !i.getNumeroBagni().equals(numeroBagni)) continue;

            if (numeroStanze != null && !i.getNumeroStanze().equals(numeroStanze)) continue;

            if (categoria != null && !i.getCategoria().equalsIgnoreCase(categoria)) continue;

            if (classeEnergetica != null && !i.getClasseEnergetica().equalsIgnoreCase(classeEnergetica))
                continue;

            if (nomeCitta != null && !i.getNomeCitta().equalsIgnoreCase(nomeCitta)) continue;

            if (provincia != null && !i.getProvincia().equalsIgnoreCase(provincia)) continue;

            if (cap != null && !i.getCap().equalsIgnoreCase(cap)) continue;

            if (garage != null && i.isGarage() != garage) continue;

            if (climatizzazione != null && i.isClimatizzazione() != climatizzazione) continue;

            if (terrazzo != null && i.isTerrazzo() != terrazzo) continue;

            risultati.add(i);
        }

        return risultati;
    }


}

