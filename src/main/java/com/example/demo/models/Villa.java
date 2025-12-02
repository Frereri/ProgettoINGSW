package com.example.demo.models;

import java.time.LocalDate;

public class Villa extends Immobile{

	private int numeroPiani;
	private int superficieNonCalpestabile;
	private boolean piscina;
	
	
	public Villa() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Villa(Long idImmobile, String via, String numeroCivico, String immagine, String descrizione, int superficie,
			double prezzo, LocalDate dataPubblicazione, String nomeCitta, Integer numeroBagni, String categoria,
			boolean garage, boolean climatizzazione, boolean terrazzo, Integer numeroStanze, String classeEnergetica,
			Double latitudine, Double longitudine, String cap, String provincia, String emailAgente) {
		super(idImmobile, via, numeroCivico, immagine, descrizione, superficie, prezzo, dataPubblicazione, nomeCitta,
				numeroBagni, categoria, garage, climatizzazione, terrazzo, numeroStanze, classeEnergetica, latitudine,
				longitudine, cap, provincia, emailAgente);
		// TODO Auto-generated constructor stub
	
		setNumeroPiani(numeroPiani);
		setSuperficieNonCalpestabile(superficieNonCalpestabile);
		setPiscina(piscina);
	}
	
	
	public int getNumeroPiani() {
		return numeroPiani;
	}
	public void setNumeroPiani(int numeroPiani) {
		this.numeroPiani = numeroPiani;
	}
	public int getSuperficieNonCalpestabile() {
		return superficieNonCalpestabile;
	}
	public void setSuperficieNonCalpestabile(int superficieNonCalpestabile) {
		this.superficieNonCalpestabile = superficieNonCalpestabile;
	}
	public boolean isPiscina() {
		return piscina;
	}
	public void setPiscina(boolean piscina) {
		this.piscina = piscina;
	}

	
}
