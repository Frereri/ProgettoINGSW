package com.example.demo.DTO;

public class CambiaPasswordDTO {

	private String vecchiaPassword;
    private String nuovaPassword;
    
    public CambiaPasswordDTO() {
    	
    }

	public String getVecchiaPassword() {
		return vecchiaPassword;
	}

	public void setVecchiaPassword(String vecchiaPassword) {
		this.vecchiaPassword = vecchiaPassword;
	}

	public String getNuovaPassword() {
		return nuovaPassword;
	}

	public void setNuovaPassword(String nuovaPassword) {
		this.nuovaPassword = nuovaPassword;
	}
    
    
}
