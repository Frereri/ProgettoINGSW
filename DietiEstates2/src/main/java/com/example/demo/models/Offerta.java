package com.example.demo.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Offerta {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_offerta")
    private Integer idOfferta;

    @Column(name = "prezzo_offerto", nullable = false)
    private double prezzoOfferto;

    @Column(name = "prezzo_originale")
    private double prezzoOriginale;

    @Column(name = "stato")
    private String stato = "IN_ATTESA";
    
    @Column(name = "offerta_esterna")
    private boolean offertaEsterna = false;

    @Column(name = "data_creazione", insertable = false, updatable = false)
    private LocalDateTime dataCreazione;

    @Column(name = "data_ultimo_aggiornamento")
    private LocalDateTime dataUltimoAggiornamento;

    @Column(name = "prezzo_controfferta")
    private Double prezzoControfferta;
    
    @Column(name = "nome_cliente_esterno", length = 50)
    private String nomeClienteEsterno;

    @Column(name = "contatto_cliente_esterno", length = 100)
    private String contattoClienteEsterno;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_immobile", nullable = false)
    private Immobile immobile;
    
    public Offerta() {
    	
    }

	public Offerta(Integer idOfferta, double prezzoOfferto, double prezzoOriginale, String stato,
			boolean offertaEsterna, LocalDateTime dataCreazione, LocalDateTime dataUltimoAggiornamento,
			Double prezzoControfferta, String nomeClienteEsterno, String contattoClienteEsterno, Cliente cliente,
			Immobile immobile) {
		super();
		this.idOfferta = idOfferta;
		this.prezzoOfferto = prezzoOfferto;
		this.prezzoOriginale = prezzoOriginale;
		this.stato = stato;
		this.offertaEsterna = offertaEsterna;
		this.dataCreazione = dataCreazione;
		this.dataUltimoAggiornamento = dataUltimoAggiornamento;
		this.prezzoControfferta = prezzoControfferta;
		this.nomeClienteEsterno = nomeClienteEsterno;
		this.contattoClienteEsterno = contattoClienteEsterno;
		this.cliente = cliente;
		this.immobile = immobile;
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

	public LocalDateTime getDataUltimoAggiornamento() {
		return dataUltimoAggiornamento;
	}

	public void setDataUltimoAggiornamento(LocalDateTime dataUltimoAggiornamento) {
		this.dataUltimoAggiornamento = dataUltimoAggiornamento;
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

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

	public Immobile getImmobile() {
		return immobile;
	}

	public void setImmobile(Immobile immobile) {
		this.immobile = immobile;
	}
    
    
}
