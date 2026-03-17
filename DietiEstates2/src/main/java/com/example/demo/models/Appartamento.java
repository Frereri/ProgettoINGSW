package com.example.demo.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;


@Entity
@DiscriminatorValue("APPARTAMENTO")
public class Appartamento extends Immobile {

    @Column(name = "piano")
    private Integer piano;
    
    @Column(name = "ascensore")
    private boolean ascensore = false;
    
    @Column(name = "portineria")
    private boolean portineria = false;

    public Appartamento() {
		super();
	}

	public Appartamento(Integer piano, boolean ascensore, boolean portineria) {
		super();
		this.piano = piano;
		this.ascensore = ascensore;
		this.portineria = portineria;
	}

	public Integer getPiano() {
		return piano;
	}

	public void setPiano(Integer piano) {
		this.piano = piano;
	}

	public boolean isAscensore() {
		return ascensore;
	}

	public void setAscensore(boolean ascensore) {
		this.ascensore = ascensore;
	}

	public boolean isPortineria() {
		return portineria;
	}

	public void setPortineria(boolean portineria) {
		this.portineria = portineria;
	}
    
    
}
