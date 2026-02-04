package com.example.demo3.models;




import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;


@Entity
@Table(name="cliente", schema="dietiestes")
public class Cliente extends Utente{

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
	private Integer idCliente;
	

	
	public Cliente() {
		super();
	}
	
	
	public Cliente(Integer idCliente, Agente agenteDiRiferimento) {
		super();
		this.idCliente = idCliente;

	}


	public Integer getIdCliente() {
		return idCliente;
	}


	public void setIdCliente(Integer idCliente) {
		this.idCliente = idCliente;
	}


	@Override
	public String toString() {
		return "Cliente [idCliente=" + idCliente + ", getNome()=" + getNome() + ", getCognome()=" + getCognome()
				+ ", getEmail()=" + getEmail() + ", getPassword()=" + getPassword() + ", getClass()=" + getClass()
				+ ", hashCode()=" + hashCode() + ", toString()=" + super.toString() + "]";
	}
	
	
}
