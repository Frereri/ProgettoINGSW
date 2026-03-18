package com.example.demo.DTO;

public class RichiestaLoginDTO {

	private String email;
    private String password;
    
    public RichiestaLoginDTO() {
        // Costruttore vuoto richiesto per la deserializzazione JSON
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
