package com.example.demo.models;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "storico_offerta", schema = "dietiestates")
public class StoricoOfferta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_log")
    private Integer idLog;

    @ManyToOne
    @JoinColumn(name = "id_offerta", nullable = false)
    private Offerta offerta;

    @Column(name = "stato_precedente", length = 30)
    private String statoPrecedente;

    @Column(name = "nuovo_stato", length = 30)
    private String nuovoStato;

    @Column(name = "prezzo_scambiato")
    private Double prezzoScambiato;

    @Column(name = "nota", columnDefinition = "TEXT")
    private String nota;

    @Column(name = "data_azione", updatable = false)
    @CreationTimestamp
    private LocalDateTime dataAzione;

    @Column(name = "autore_azione", nullable = false)
    private UUID autoreAzione;

	public StoricoOfferta() {
		super();
	}

	public StoricoOfferta(Integer idLog, Offerta offerta, String statoPrecedente, String nuovoStato,
			Double prezzoScambiato, String nota, LocalDateTime dataAzione, UUID autoreAzione) {
		super();
		this.idLog = idLog;
		this.offerta = offerta;
		this.statoPrecedente = statoPrecedente;
		this.nuovoStato = nuovoStato;
		this.prezzoScambiato = prezzoScambiato;
		this.nota = nota;
		this.dataAzione = dataAzione;
		this.autoreAzione = autoreAzione;
	}

	public Integer getIdLog() {
		return idLog;
	}

	public void setIdLog(Integer idLog) {
		this.idLog = idLog;
	}

	public Offerta getOfferta() {
		return offerta;
	}

	public void setOfferta(Offerta offerta) {
		this.offerta = offerta;
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
