package com.example.demo.models;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
@DiscriminatorValue("CLIENTE")
public class Cliente extends Utente {
	
	@OneToMany(mappedBy = "cliente")
    private List<Offerta> offerte;

	public Cliente() {
		super();
	}

	public Cliente(List<Offerta> offerte) {
		super();
		this.offerte = offerte;
	}

	public List<Offerta> getOfferte() {
		return offerte;
	}

	public void setOfferte(List<Offerta> offerte) {
		this.offerte = offerte;
	}
	
	
}
