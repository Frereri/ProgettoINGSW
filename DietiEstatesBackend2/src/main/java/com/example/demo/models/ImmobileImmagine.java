package com.example.demo.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "immobile_immagine", schema = "dietiestates")
public class ImmobileImmagine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_immagine")
    private Integer idImmagine;

    @ManyToOne
    @JoinColumn(name = "id_immobile", nullable = false)
    private Immobile immobile;

    @Column(name = "url_immagine", nullable = false, columnDefinition = "TEXT")
    private String urlImmagine;

    @Column(name = "is_copertina")
    private boolean isCopertina = false;

    public ImmobileImmagine() {
    	super();
    }

	public ImmobileImmagine(Integer idImmagine, Immobile immobile, String urlImmagine, boolean isCopertina) {
		super();
		this.idImmagine = idImmagine;
		this.immobile = immobile;
		this.urlImmagine = urlImmagine;
		this.isCopertina = isCopertina;
	}

	public Integer getIdImmagine() {
		return idImmagine;
	}

	public void setIdImmagine(Integer idImmagine) {
		this.idImmagine = idImmagine;
	}

	public Immobile getImmobile() {
		return immobile;
	}

	public void setImmobile(Immobile immobile) {
		this.immobile = immobile;
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
