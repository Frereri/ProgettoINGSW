package com.example.demo3.DTO;

public class CaricaImmobileDTO {
    private String titolo;
    private String indirizzo;
    private String descrizione;
    private Integer dimensioni;
    private double prezzo;
    private String piano;
    private Integer numeroStanze;
    private String classeEnergetica;
    private boolean ascensore;
    private boolean portineria;
    private boolean climatizzazione;
    private boolean boxAuto;
    private boolean terrazzo;
    private boolean giardino;
    private String tipoAnnuncio;
    private String emailAgente;


    public CaricaImmobileDTO() {
    }


    public CaricaImmobileDTO(String titolo, String indirizzo, String descrizione, Integer dimensioni, double prezzo,
                             String piano, Integer numeroStanze, String classeEnergetica, boolean ascensore,
                             boolean portineria, boolean climatizzazione, boolean boxAuto, boolean terrazzo,
                             boolean giardino, String tipoAnnuncio, String emailAgente) {
        this.titolo = titolo;
        this.indirizzo = indirizzo;
        this.descrizione = descrizione;
        this.dimensioni = dimensioni;
        this.prezzo = prezzo;
        this.piano = piano;
        this.numeroStanze = numeroStanze;
        this.classeEnergetica = classeEnergetica;
        this.ascensore = ascensore;
        this.portineria = portineria;
        this.climatizzazione = climatizzazione;
        this.boxAuto = boxAuto;
        this.terrazzo = terrazzo;
        this.giardino = giardino;
        this.tipoAnnuncio = tipoAnnuncio;
        this.emailAgente = emailAgente;
    }


	public String getTitolo() {
		return titolo;
	}


	public void setTitolo(String titolo) {
		this.titolo = titolo;
	}


	public String getIndirizzo() {
		return indirizzo;
	}


	public void setIndirizzo(String indirizzo) {
		this.indirizzo = indirizzo;
	}


	public String getDescrizione() {
		return descrizione;
	}


	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}


	public Integer getDimensioni() {
		return dimensioni;
	}


	public void setDimensioni(Integer dimensioni) {
		this.dimensioni = dimensioni;
	}


	public double getPrezzo() {
		return prezzo;
	}


	public void setPrezzo(double prezzo) {
		this.prezzo = prezzo;
	}


	public String getPiano() {
		return piano;
	}


	public void setPiano(String piano) {
		this.piano = piano;
	}


	public Integer getNumeroStanze() {
		return numeroStanze;
	}


	public void setNumeroStanze(Integer numeroStanze) {
		this.numeroStanze = numeroStanze;
	}


	public String getClasseEnergetica() {
		return classeEnergetica;
	}


	public void setClasseEnergetica(String classeEnergetica) {
		this.classeEnergetica = classeEnergetica;
	}


	public boolean isAscensore() {
		return ascensore;
	}


	public void setAscensore(boolean ascensore) {
		this.ascensore = ascensore;
	}


	public boolean isPortineria() {
		return portineria;
	}


	public void setPortineria(boolean portineria) {
		this.portineria = portineria;
	}


	public boolean isClimatizzazione() {
		return climatizzazione;
	}


	public void setClimatizzazione(boolean climatizzazione) {
		this.climatizzazione = climatizzazione;
	}


	public boolean isBoxAuto() {
		return boxAuto;
	}


	public void setBoxAuto(boolean boxAuto) {
		this.boxAuto = boxAuto;
	}


	public boolean isTerrazzo() {
		return terrazzo;
	}


	public void setTerrazzo(boolean terrazzo) {
		this.terrazzo = terrazzo;
	}


	public boolean isGiardino() {
		return giardino;
	}


	public void setGiardino(boolean giardino) {
		this.giardino = giardino;
	}


	public String getTipoAnnuncio() {
		return tipoAnnuncio;
	}


	public void setTipoAnnuncio(String tipoAnnuncio) {
		this.tipoAnnuncio = tipoAnnuncio;
	}


	public String getEmailAgente() {
		return emailAgente;
	}


	public void setEmailAgente(String emailAgente) {
		this.emailAgente = emailAgente;
	}

    
}