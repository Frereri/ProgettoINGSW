package com.example.demo.DTO;

public class RegistrazioneClienteDTO {

	private ClienteDTO datiProfilo;
    private String password;
    
    public RegistrazioneClienteDTO(){
    	
    }

	public ClienteDTO getDatiProfilo() {
		return datiProfilo;
	}

	public void setDatiProfilo(ClienteDTO datiProfilo) {
		this.datiProfilo = datiProfilo;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
    
    
}
