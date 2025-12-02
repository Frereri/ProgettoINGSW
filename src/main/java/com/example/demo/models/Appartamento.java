package com.example.demo.models;

import java.time.LocalDate;

public class Appartamento extends Immobile{

	private int piano;
	private char scala;
	private boolean ascensore;
	private boolean portineria;
	
	
	public Appartamento() {
		super();
		// TODO Auto-generated constructor stub
	}
	

	
	public Appartamento(Long idImmobile, String via, String numeroCivico, String immagine, String descrizione,
			int superficie, double prezzo, LocalDate dataPubblicazione, String nomeCitta, Integer numeroBagni,
			String categoria, boolean garage, boolean climatizzazione, boolean terrazzo, Integer numeroStanze,
			String classeEnergetica, Double latitudine, Double longitudine, String cap, String provincia,
			String emailAgente) {
		super(idImmobile, via, numeroCivico, immagine, descrizione, superficie, prezzo, dataPubblicazione, nomeCitta,
				numeroBagni, categoria, garage, climatizzazione, terrazzo, numeroStanze, classeEnergetica, latitudine,
				longitudine, cap, provincia, emailAgente);
		// TODO Auto-generated constructor stub
	
		setPiano(piano);
		setScala(scala);
		setAscensore(ascensore);		
		setPortineria(portineria);
	}

	public int getPiano() {
		return piano;
	}
	public void setPiano(int piano) {
		this.piano = piano;
	}
	public char getScala() {
		return scala;
	}
	public void setScala(char scala) {
		this.scala = scala;
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
	
}
