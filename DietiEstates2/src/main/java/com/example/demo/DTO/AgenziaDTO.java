package com.example.demo.DTO;

public class AgenziaDTO {

	private Integer idAgenzia;
    private String nomeAgenzia;
    private String partitaIva;
    
    private int numeroAgenti;
    private int numeroImmobili;
    
    public AgenziaDTO() {
    	
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

	public String getPartitaIva() {
		return partitaIva;
	}

	public void setPartitaIva(String partitaIva) {
		this.partitaIva = partitaIva;
	}

	public int getNumeroAgenti() {
		return numeroAgenti;
	}

	public void setNumeroAgenti(int numeroAgenti) {
		this.numeroAgenti = numeroAgenti;
	}

	public int getNumeroImmobili() {
		return numeroImmobili;
	}

	public void setNumeroImmobili(int numeroImmobili) {
		this.numeroImmobili = numeroImmobili;
	}
    
    
}
