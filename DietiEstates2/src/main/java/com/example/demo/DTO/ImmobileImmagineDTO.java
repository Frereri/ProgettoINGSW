package com.example.demo.DTO;

public class ImmobileImmagineDTO {

	private Integer idImmagine;
    private Integer idImmobile;
    private String urlImmagine;
    private boolean isCopertina;
    
    public ImmobileImmagineDTO(){
    	
    }

	public Integer getIdImmagine() {
		return idImmagine;
	}

	public void setIdImmagine(Integer idImmagine) {
		this.idImmagine = idImmagine;
	}

	public Integer getIdImmobile() {
		return idImmobile;
	}

	public void setIdImmobile(Integer idImmobile) {
		this.idImmobile = idImmobile;
	}

	public String getUrlImmagine() {
		return urlImmagine;
	}

	public void setUrlImmagine(String urlImmagine) {
		this.urlImmagine = urlImmagine;
	}

	public boolean isCopertina() {
		return isCopertina;
	}

	public void setCopertina(boolean isCopertina) {
		this.isCopertina = isCopertina;
	}
    
    
}
