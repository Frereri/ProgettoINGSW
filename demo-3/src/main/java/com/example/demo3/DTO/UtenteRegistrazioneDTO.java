package com.example.demo3.DTO;

public class UtenteRegistrazioneDTO {
	
	private String email;
	private String password;
	private String confermaPassword;
	
	
	
	public UtenteRegistrazioneDTO() {

	}
	
	
	public UtenteRegistrazioneDTO(String email, String password, String confermaPassword) {
		this.email = email;
		this.password = password;
		this.confermaPassword = confermaPassword;
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
	public String getConfermaPassword() {
		return confermaPassword;
	}
	public void setConfermaPassword(String confermaPassword) {
		this.confermaPassword = confermaPassword;
	}
	
	
}
