package com.example.demo.DTO;

public class RispostaLoginDTO {
	
	private String idToken;
    private String accessToken;
    private String refreshToken;
    
    public RispostaLoginDTO() {
        // Costruttore vuoto richiesto per la deserializzazione JSON
    }

	public String getIdToken() {
		return idToken;
	}

	public void setIdToken(String idToken) {
		this.idToken = idToken;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}
    
    
}
