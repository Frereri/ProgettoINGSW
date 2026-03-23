package com.example.demo.models;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="agenzia", schema="dietiestates")
public class Agenzia {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "id_agenzia")
    private Integer idAgenzia;
    
    @Column(name="nome_agenzia", nullable = false, length = 100)
    private String nomeAgenzia;
    
    @Column(name="partita_iva", nullable = false, length = 20)
    private String partitaIva;
    
    @OneToMany(mappedBy = "agenzia")
    private List<Agente> agenti; 
    
    @OneToMany(mappedBy = "agenzia")
    private List<Immobile> immobili;
	
	
	public Agenzia() {

	}


	public Agenzia(Integer idAgenzia, String nomeAgenzia, String partitaIva, List<Agente> agenti,
			List<Immobile> immobili) {
		super();
		this.idAgenzia = idAgenzia;
		this.nomeAgenzia = nomeAgenzia;
		this.partitaIva = partitaIva;
		this.agenti = agenti;
		this.immobili = immobili;
	}


	public Integer getIdAgenzia() {
		return idAgenzia;
	}


	public void setIdAgenzia(Integer idAgenzia) {
		this.idAgenzia = idAgenzia;
	}


	public String getNomeAgenzia() {
		return nomeAgenzia;
	}


	public void setNomeAgenzia(String nomeAgenzia) {
		this.nomeAgenzia = nomeAgenzia;
	}


	public String getPartitaIva() {
		return partitaIva;
	}


	public void setPartitaIva(String partitaIva) {
		this.partitaIva = partitaIva;
	}


	public List<Agente> getAgenti() {
		return agenti;
	}


	public void setAgenti(List<Agente> agenti) {
		this.agenti = agenti;
	}


	public List<Immobile> getImmobili() {
		return immobili;
	}


	public void setImmobili(List<Immobile> immobili) {
		this.immobili = immobili;
	}


}
