package com.example.demo.models;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
@DiscriminatorValue("AGENTE")
public class Agente extends Utente {
	
    @ManyToOne
    @JoinColumn(name = "id_agenzia")
    private Agenzia agenzia;

    @OneToMany(mappedBy = "agente")
    private List<Immobile> immobili;

	public Agente() {
		super();
	}

	public Agente(Agenzia agenzia, List<Immobile> immobili) {
		super();
		this.agenzia = agenzia;
		this.immobili = immobili;
	}

	public Agenzia getAgenzia() {
		return agenzia;
	}

	public void setAgenzia(Agenzia agenzia) {
		this.agenzia = agenzia;
	}

	public List<Immobile> getImmobili() {
		return immobili;
	}

	public void setImmobili(List<Immobile> immobili) {
		this.immobili = immobili;
	}
    
    
}