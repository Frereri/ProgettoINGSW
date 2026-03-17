package com.example.demo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@DiscriminatorValue("GESTORE")
public class Gestore extends Utente {
	
    @ManyToOne
    @JoinColumn(name = "id_agenzia")
    private Agenzia agenzia;

	public Gestore() {
		super();
	}

	public Gestore(Agenzia agenzia) {
		super();
		this.agenzia = agenzia;
	}

	public Agenzia getAgenzia() {
		return agenzia;
	}

	public void setAgenzia(Agenzia agenzia) {
		this.agenzia = agenzia;
	}
    
    
}