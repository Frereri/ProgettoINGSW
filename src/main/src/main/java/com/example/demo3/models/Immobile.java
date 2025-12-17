package com.example.demo3.models;

public abstract class Immobile {

    private Long idImmobile;
    private String titolo;
    private String indirizzo;
    private String immagine;
    private String descrizione;
    private int dimensioni;
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
    private String tipoImmobile;   
    private String emailAgente;
	
    
    public Immobile() {
    	
    }
    
    public Immobile(Long idImmobile, String titolo, String indirizzo, String immagine, String descrizione,
			int dimensioni, double prezzo, String piano, Integer numeroStanze, String classeEnergetica,
			boolean ascensore, boolean portineria, boolean climatizzazione, boolean boxAuto, boolean terrazzo,
			boolean giardino, String tipoAnnuncio, String tipoImmobile, String emailAgente) {
		super();
		this.idImmobile = idImmobile;
		this.titolo = titolo;
		this.indirizzo = indirizzo;
		this.immagine = immagine;
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
		this.tipoImmobile = tipoImmobile;
		this.emailAgente = emailAgente;
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
	
	
	public String getIndirizzo() {
		return indirizzo;
	}
	public void setIndirizzo(String indirizzo) {
		this.indirizzo = indirizzo;
	}
	
	
	public String getImmagine() {
		return immagine;
	}
	public void setImmagine(String immagine) {
		this.immagine = immagine;
	}
	
	
	public String getDescrizione() {
		return descrizione;
	}
	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}
	
	
	public int getDimensioni() {
		return dimensioni;
	}
	public void setDimensioni(int dimensioni) {
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
	
	
	public String getTipoImmobile() {
		return tipoImmobile;
	}
	public void setTipoImmobile(String tipoImmobile) {
		this.tipoImmobile = tipoImmobile;
	}
	
	
	public String getEmailAgente() {
		return emailAgente;
	}
	public void setEmailAgente(String emailAgente) {
		this.emailAgente = emailAgente;
	}    

   
    
    
}
