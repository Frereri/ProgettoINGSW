package com.example.demo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SUPPORTO_AMMINISTRATORE")
public class SupportoAmministratore extends Utente {

	public SupportoAmministratore() { 
		super();
	}
}
