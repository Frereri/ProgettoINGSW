package com.example.demo.dto;

public class CreazioneStaffDTO {

	private UtenteDTO datiProfilo;
	
	public CreazioneStaffDTO () {
	    // Costruttore vuoto richiesto per la deserializzazione JSON
	}

	public UtenteDTO getDatiProfilo() {
		return datiProfilo;
	}

	public void setDatiProfilo(UtenteDTO datiProfilo) {
		this.datiProfilo = datiProfilo;
	}
	
	
}
