package com.example.demo.dto;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
  use = JsonTypeInfo.Id.NAME, 
  include = JsonTypeInfo.As.EXISTING_PROPERTY,
  property = "ruolo", 
  visible = true)
@JsonSubTypes({
  @JsonSubTypes.Type(value = ClienteDTO.class, name = "CLIENTE"),
  @JsonSubTypes.Type(value = AgenteDTO.class, name = "AGENTE"),
  @JsonSubTypes.Type(value = GestoreDTO.class, name = "GESTORE"),
  @JsonSubTypes.Type(value = AmministratoreDTO.class, name = "AMMINISTRATORE"),
  @JsonSubTypes.Type(value = SupportoAmministratoreDTO.class, name = "SUPPORTO_AMMINISTRATORE")
})
public abstract class UtenteDTO {

	private UUID idUtente;
    private String nome;
    private String cognome;
    private String email;
    private String ruolo;
	
    protected UtenteDTO() {
		super();
	}
    
	public UUID getIdUtente() {
		return idUtente;
	}
	
	public void setIdUtente(UUID idUtente) {
		this.idUtente = idUtente;
	}
	
	public String getNome() {
		return nome;
	}
	
	public void setNome(String nome) {
		this.nome = nome;
	}
	
	public String getCognome() {
		return cognome;
	}
	
	public void setCognome(String cognome) {
		this.cognome = cognome;
	}
	
	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getRuolo() {
		return ruolo;
	}
	
	public void setRuolo(String ruolo) {
		this.ruolo = ruolo;
	}
    
    
}
