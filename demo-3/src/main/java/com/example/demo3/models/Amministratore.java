package com.example.demo3.models;

public class Amministratore extends Utente {
	private String partitaIva;
	private String nomeAgenziaImmobiliare;
	
	
	
	public Amministratore() {
		super();
	}
	
	


	public Amministratore(String nome, String cognome, String email, String password, String partitaIva, String nomeAgenziaImmobiliare) {
		super(nome, cognome, email, password);
		setPartitaIva( partitaIva);
		setNomeAgenziaImmobiliare(nomeAgenziaImmobiliare);
	}




	public String getPartitaIva() {
		return partitaIva;
	}



	public void setPartitaIva(String partitaIva) {
		this.partitaIva = partitaIva;
	}



	public String getNomeAgenziaImmobiliare() {
		return nomeAgenziaImmobiliare;
	}



	public void setNomeAgenziaImmobiliare(String nomeAgenziaImmobiliare) {
		this.nomeAgenziaImmobiliare = nomeAgenziaImmobiliare;
	}
	
	
	
	
}
