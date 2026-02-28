package com.example.demo.DTO;

import java.time.LocalDateTime;
import java.util.UUID;

public class OffertaDTO {

	private Integer idOfferta;
    private double prezzoOfferto;
    private double prezzoOriginale;
    private String stato;
    private boolean offertaEsterna;
    private LocalDateTime dataCreazione;
    private Double prezzoControfferta;
    private String nomeClienteEsterno;
    private String contattoClienteEsterno;
    private UUID idCliente;
    private String nomeCognomeCliente;
    private Integer idImmobile;
    private String titoloImmobile;
    private String immagineImmobile;
	
    public OffertaDTO () {
    	
    }

	public Integer getIdOfferta() {
		return idOfferta;
	}

	public void setIdOfferta(Integer idOfferta) {
		this.idOfferta = idOfferta;
	}

	public double getPrezzoOfferto() {
		return prezzoOfferto;
	}

	public void setPrezzoOfferto(double prezzoOfferto) {
		this.prezzoOfferto = prezzoOfferto;
	}

	public double getPrezzoOriginale() {
		return prezzoOriginale;
	}

	public void setPrezzoOriginale(double prezzoOriginale) {
		this.prezzoOriginale = prezzoOriginale;
	}

	public String getStato() {
		return stato;
	}

	public void setStato(String stato) {
		this.stato = stato;
	}

	public boolean isOffertaEsterna() {
		return offertaEsterna;
	}

	public void setOffertaEsterna(boolean offertaEsterna) {
		this.offertaEsterna = offertaEsterna;
	}

	public LocalDateTime getDataCreazione() {
		return dataCreazione;
	}

	public void setDataCreazione(LocalDateTime dataCreazione) {
		this.dataCreazione = dataCreazione;
	}

	public Double getPrezzoControfferta() {
		return prezzoControfferta;
	}

	public void setPrezzoControfferta(Double prezzoControfferta) {
		this.prezzoControfferta = prezzoControfferta;
	}

	public String getNomeClienteEsterno() {
		return nomeClienteEsterno;
	}

	public void setNomeClienteEsterno(String nomeClienteEsterno) {
		this.nomeClienteEsterno = nomeClienteEsterno;
	}

	public String getContattoClienteEsterno() {
		return contattoClienteEsterno;
	}

	public void setContattoClienteEsterno(String contattoClienteEsterno) {
		this.contattoClienteEsterno = contattoClienteEsterno;
	}

	public UUID getIdCliente() {
		return idCliente;
	}

	public void setIdCliente(UUID idCliente) {
		this.idCliente = idCliente;
	}

	public String getNomeCognomeCliente() {
		return nomeCognomeCliente;
	}

	public void setNomeCognomeCliente(String nomeCognomeCliente) {
		this.nomeCognomeCliente = nomeCognomeCliente;
	}

	public Integer getIdImmobile() {
		return idImmobile;
	}

	public void setIdImmobile(Integer idImmobile) {
		this.idImmobile = idImmobile;
	}

	public String getTitoloImmobile() {
		return titoloImmobile;
	}

	public void setTitoloImmobile(String titoloImmobile) {
		this.titoloImmobile = titoloImmobile;
	}

	public String getImmagineImmobile() {
		return immagineImmobile;
	}

	public void setImmagineImmobile(String immagineImmobile) {
		this.immagineImmobile = immagineImmobile;
	}
    
    
}
