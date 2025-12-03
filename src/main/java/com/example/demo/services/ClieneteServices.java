package com.example.demo3.services;

import java.util.ArrayList;
import java.util.List;

import com.example.demo3.models.Cliente;

public class ClieneteServices {
	
	private List<Cliente> clienti = new ArrayList<Cliente>();
	private List<Cliente> temp = new ArrayList<Cliente>();
	
	//Inserimento di Un nuovo cliente 
	public Cliente addCliente(Cliente client){
		clienti.add(client);
		return client;
	}
	
	//Get... (in base al nome e cognome, ne restituisce piu di uno se li trova)
	public List<Cliente> getListClienti(String nom, String cog) {
		for(int i =0;  i < clienti.size()  ; i++) {
			if((clienti.get(i).getNome().equals(nom)) && (clienti.get(i).getCognome().equals(nom)))
				temp.add(clienti.get(i));
		}
		return temp;
	}
	
	//Get..Clienti
	
	public List<Cliente> getClienti(){
		return clienti;
	}
}
