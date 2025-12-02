package com.example.demo.models;

import java.time.LocalDate;

public class Immobile {

    private Long idImmobile;
    private String via;
    private String numeroCivico;
    private String immagine;
    private String descrizione;
    private int superficie;
    private double prezzo;
    private LocalDate dataPubblicazione;
    private String nomeCitta;
    private Integer numeroBagni;
    private String categoria; // vendita | affitto
    private boolean garage;
    private boolean climatizzazione;
    private boolean terrazzo;
    private Integer numeroStanze;
    private String classeEnergetica;
    private Double latitudine;
    private Double longitudine;
    private String cap;
    private String provincia;
    private String emailAgente;
  


	public Immobile() {}
    
    public Immobile(Long idImmobile, String via, String numeroCivico, String immagine, String descrizione,
			int superficie, double prezzo, LocalDate dataPubblicazione, String nomeCitta, Integer numeroBagni,
			String categoria, boolean garage, boolean climatizzazione, boolean terrazzo, Integer numeroStanze,
			String classeEnergetica, Double latitudine, Double longitudine, String cap, String provincia,
			String emailAgente) {
		super();
		this.idImmobile = idImmobile;
		this.via = via;
		this.numeroCivico = numeroCivico;
		this.immagine = immagine;
		this.descrizione = descrizione;
		this.superficie = superficie;
		this.prezzo = prezzo;
		this.dataPubblicazione = dataPubblicazione;
		this.nomeCitta = nomeCitta;
		this.numeroBagni = numeroBagni;
		this.categoria = categoria;
		this.garage = garage;
		this.climatizzazione = climatizzazione;
		this.terrazzo = terrazzo;
		this.numeroStanze = numeroStanze;
		this.classeEnergetica = classeEnergetica;
		this.latitudine = latitudine;
		this.longitudine = longitudine;
		this.cap = cap;
		this.provincia = provincia;
		this.emailAgente = emailAgente;
	}
    
	public Long getIdImmobile() { return idImmobile; }
    public void setIdImmobile(Long idImmobile) { this.idImmobile = idImmobile; }

    public String getVia() { return via; }
    public void setVia(String via) { this.via = via; }

    public String getNumeroCivico() { return numeroCivico; }
    public void setNumeroCivico(String numeroCivico) { this.numeroCivico = numeroCivico; }

    public String getImmagine() { return immagine; }
    public void setImmagine(String immagine) { this.immagine = immagine; }

    public String getDescrizione() { return descrizione; }
    public void setDescrizione(String descrizione) { this.descrizione = descrizione; }

    public int getSuperficie() { return superficie; }
    public void setSuperficie(int superficie) { this.superficie = superficie; }

    public double getPrezzo() { return prezzo; }
    public void setPrezzo(double prezzo) { this.prezzo = prezzo; }

    public LocalDate getDataPubblicazione() { return dataPubblicazione; }
    public void setDataPubblicazione(LocalDate dataPubblicazione) { this.dataPubblicazione = dataPubblicazione; }

    public String getNomeCitta() { return nomeCitta; }
    public void setNomeCitta(String nomeCitta) { this.nomeCitta = nomeCitta; }

    public Integer getNumeroBagni() { return numeroBagni; }
    public void setNumeroBagni(Integer bagno) { this.numeroBagni = bagno; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Integer getNumeroStanze() { return numeroStanze; }
    public void setNumeroStanze(Integer numeroStanze) { this.numeroStanze = numeroStanze; }

    public String getClasseEnergetica() { return classeEnergetica; }
    public void setClasseEnergetica(String classeEnergetica) { this.classeEnergetica = classeEnergetica; }

    public Double getLatitudine() { return latitudine; }
    public void setLatitudine(Double latitudine) { this.latitudine = latitudine; }

    public Double getLongitudine() { return longitudine; }
    public void setLongitudine(Double longitudine) { this.longitudine = longitudine; }

    public String getCap() { return cap; }
    public void setCap(String cap) { this.cap = cap; }

    public String getProvincia() { return provincia; }
    public void setProvincia(String provincia) { this.provincia = provincia; }

    public boolean isGarage() {
		return garage;
	}

	public void setGarage(boolean garage) {
		this.garage = garage;
	}

	public boolean isClimatizzazione() {
		return climatizzazione;
	}

	public void setClimatizzazione(boolean climatizzazione) {
		this.climatizzazione = climatizzazione;
	}

	public boolean isTerrazzo() {
		return terrazzo;
	}

	public void setTerrazzo(boolean terrazzo) {
		this.terrazzo = terrazzo;
	}

	public String getEmailAgente() {
		return emailAgente;
	}

	public void setEmailAgente(String emailAgente) {
		this.emailAgente = emailAgente;
	}
}
