package com.example.demo.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("VILLA")
public class Villa extends Immobile{

    @Column(name = "superficie_giardino")
    private double superficieGiardino = 0.0;
    
    @Column(name = "giardino")
    private boolean giardino = false;
    
    @Column(name = "piscina")
    private boolean piscina = false;

	public Villa() {
		super();
	}

	public Villa(boolean giardino, boolean piscina) {
		super();
		this.giardino = giardino;
		this.piscina = piscina;
	}

	public boolean isGiardino() {
		return giardino;
	}

	public void setGiardino(boolean giardino) {
		this.giardino = giardino;
	}

	public boolean isPiscina() {
		return piscina;
	}

	public void setPiscina(boolean piscina) {
		this.piscina = piscina;
	}

	public double getSuperficieGiardino() {
		return superficieGiardino;
	}

	public void setSuperficieGiardino(double superficieGiardino) {
		this.superficieGiardino = superficieGiardino;
	}
    
    
}
