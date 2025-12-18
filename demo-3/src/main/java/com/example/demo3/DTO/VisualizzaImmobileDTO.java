package com.example.demo3.DTO;

public class VisualizzaImmobileDTO {
    private Long idImmobile;
    private String titolo;
    private String descrizione;
    private double prezzo;
    private String tipoAnnuncio;
    private String stato;

    public VisualizzaImmobileDTO() {
    }

    public VisualizzaImmobileDTO(Long idImmobile, String titolo, String descrizione,
                                 double prezzo, String tipoAnnuncio, String stato) {
        this.idImmobile = idImmobile;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.prezzo = prezzo;
        this.tipoAnnuncio = tipoAnnuncio;
        this.stato = stato;
    }

    public Long getIdImmobile() {
        return idImmobile;
    }


    public void setIdImmobile(Long idImmobile) {
        this.idImmobile = idImmobile;
    }


    public String getTitolo() {
        return titolo;
    }


    public void setTitolo(String titolo) {
        this.titolo = titolo;
    }


    public String getDescrizione() {
        return descrizione;
    }


    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }


    public double getPrezzo() {
        return prezzo;
    }


    public void setPrezzo(double prezzo) {
        this.prezzo = prezzo;
    }


    public String getTipoAnnuncio() {
        return tipoAnnuncio;
    }


    public void setTipoAnnuncio(String tipoAnnuncio) {
        this.tipoAnnuncio = tipoAnnuncio;
    }


    public String getStato() {
        return stato;
    }


    public void setStato(String stato) {
        this.stato = stato;
    }
}