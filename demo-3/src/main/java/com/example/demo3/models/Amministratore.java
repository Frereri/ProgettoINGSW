package com.example.demo3.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

//@Entity
public class Amministratore extends Utente {
	//@Column(nullable = false, length = 20)
	private String partitaIva;
	//@Column(nullable = false, length = 255)
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




	@Override
	public String toString() {
		return "Amministratore [partitaIva=" + partitaIva + ", nomeAgenziaImmobiliare=" + nomeAgenziaImmobiliare
				+ ", getNome()=" + getNome() + ", getCognome()=" + getCognome() + ", getEmail()=" + getEmail()
				+ ", getPassword()=" + getPassword() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode()
				+ ", toString()=" + super.toString() + "]";
	}
	
	
	
	
}