package com.example.demo.DTO;

public class GestoreDTO extends UtenteDTO {
    
	private Integer idAgenzia;
    private String nomeAgenzia;

    public GestoreDTO() {
        super();
        this.setRuolo("GESTORE");
    }

	public Integer getIdAgenzia() {
		return idAgenzia;
	}

	public void setIdAgenzia(Integer idAgenzia) {
		this.idAgenzia = idAgenzia;
	}

	public String getNomeAgenzia() {
		return nomeAgenzia;
	}

	public void setNomeAgenzia(String nomeAgenzia) {
		this.nomeAgenzia = nomeAgenzia;
	}
    
    
}
