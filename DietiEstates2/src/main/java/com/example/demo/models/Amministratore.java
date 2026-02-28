package com.example.demo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("AMMINISTRATORE")
public class Amministratore extends Utente {

	public Amministratore() {
        super();
    }
}
