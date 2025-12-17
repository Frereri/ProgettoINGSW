package com.example.demo3.models;

import java.util.List;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name="agente", schema="dietiestes")
public class Agente extends Utente{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name= "id_agente")
	private Integer idAgente;
	@Column(name="partitaiva")
	private String partitaIva;
	

	
	
	public Agente() {
		super();
	}

	
	
	
	public Agente(Integer idAgente, String partitaIva, List<Cliente> elenciClienti) {
		super();
		this.idAgente = idAgente;
		this.partitaIva = partitaIva;

	}

	public String getPartitaIva() {
		return partitaIva;
	}

	public void setPartitaIva(String partitaIva) {
		this.partitaIva = partitaIva;
	}

	public Integer getIdAgente() {
		return idAgente;
	}

	public void setIdAgente(Integer idAgente) {
		this.idAgente = idAgente;
	}


	
}
