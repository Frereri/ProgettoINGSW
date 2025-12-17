package com.example.demo3.models;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class Utente {
	@Column(nullable = false, length = 255)
	private String nome;
	@Column(nullable = false, length = 255)
	private String cognome;
	@Column(nullable = false, length = 255) 
	private String email;
	@Column(nullable = false, length = 255)
	private String password;
	 
	
	
	public Utente() {
		
	}
	
	public Utente(String nome, String cognome, String email, String password) {
		super();
		this.nome = nome;
		this.cognome = cognome;
		this.email = email;
		this.password = password;
	}
	
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getCognome() {
		return cognome;
	}
	public void setCognome(String cognome) {
		this.cognome = cognome;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	

	
	
	
}
