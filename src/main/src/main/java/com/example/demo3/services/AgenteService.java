package com.example.demo3.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo3.models.Agente;

@Service
public class AgenteService {
	
	private List<Agente> agenti = new ArrayList<Agente>();
	private List<Agente> temp = new ArrayList<Agente>();
	
	
	//Add..Agente
	public Agente addAgent(Agente Agent) {
		agenti.add(Agent);
		return Agent;
	}
	
	
	//Get..agnete stramite ParitaIva 
	public Agente getAgente(String partIva) {
		for (int i= 0 ; i< agenti.size() ; i++) {
			if (agenti.get(i).getPartitaIva().equals(partIva))
				return agenti.get(i);
		}
		return null;
	}
	
	//Get... agenti in base all' agenzia
	public List<Agente> getListAgenti(String nomeAgenzia){
		for (int i= 0 ; i< agenti.size() ; i++) {
			if (agenti.get(i).getPartitaIva().equals(nomeAgenzia))
				temp.add(agenti.get(i));
		}
		return temp;
	}
}
