package com.example.demo.DTO;

import java.time.LocalDateTime;
import java.util.UUID;

public class StoricoOffertaDTO {

	private Integer idLog;
    private Integer idOfferta;
    private String statoPrecedente;
    private String nuovoStato;
    private Double prezzoScambiato;
    private String nota;
    private LocalDateTime dataAzione;
    private UUID autoreAzione;
    
    public StoricoOffertaDTO() {
    	
    }

	public Integer getIdLog() {
		return idLog;
	}

	public void setIdLog(Integer idLog) {
		this.idLog = idLog;
	}

	public Integer getIdOfferta() {
		return idOfferta;
	}

	public void setIdOfferta(Integer idOfferta) {
		this.idOfferta = idOfferta;
	}

	public String getStatoPrecedente() {
		return statoPrecedente;
	}

	public void setStatoPrecedente(String statoPrecedente) {
		this.statoPrecedente = statoPrecedente;
	}

	public String getNuovoStato() {
		return nuovoStato;
	}

	public void setNuovoStato(String nuovoStato) {
		this.nuovoStato = nuovoStato;
	}

	public Double getPrezzoScambiato() {
		return prezzoScambiato;
	}

	public void setPrezzoScambiato(Double prezzoScambiato) {
		this.prezzoScambiato = prezzoScambiato;
	}

	public String getNota() {
		return nota;
	}

	public void setNota(String nota) {
		this.nota = nota;
	}

	public LocalDateTime getDataAzione() {
		return dataAzione;
	}

	public void setDataAzione(LocalDateTime dataAzione) {
		this.dataAzione = dataAzione;
	}

	public UUID getAutoreAzione() {
		return autoreAzione;
	}

	public void setAutoreAzione(UUID autoreAzione) {
		this.autoreAzione = autoreAzione;
	}
    
    
}
