
package com.example.demo3.models;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Offerta {
    @Id
    private Integer idOfferta;
    @Column(nullable = false)
    private double prezzoProposto;
    @Column(nullable = false)
    private LocalDate dataOfferta;
    @Column(nullable = false, length = 255)
    private String stato;
    @Column
    private Double controfferta;

    
    public Offerta() {}

    
    public Offerta(Integer idOfferta,
                   double prezzoProposto, LocalDate dataOfferta, String stato,
                   Double controfferta) {

        this.idOfferta = idOfferta;
        this.prezzoProposto = prezzoProposto;
        this.dataOfferta = dataOfferta;
        this.stato = stato;
        this.controfferta = controfferta;
    }


    public Integer getIdOfferta() { 
    	return idOfferta;
    }
    public void setIdOfferta(Integer id) { 
    	this.idOfferta = id;
    }

    public double getPrezzoProposto() { 
    	return prezzoProposto;
    }
    public void setPrezzoProposto(double prezzo) { 
    	this.prezzoProposto = prezzo;
    }

    public LocalDate getDataOfferta() { 
    	return dataOfferta;
    }
    public void setDataOfferta(LocalDate dataOfferta) { 
    	this.dataOfferta = dataOfferta;
    }

    public String getStato() { 
    	return stato;
    }
    public void setStato(String stato) { 
    	this.stato = stato;
    }

    public Double getControfferta() { 
    	return controfferta;
    }
    public void setControfferta(Double controfferta) { 
    	this.controfferta = controfferta;
    }


	@Override
	public String toString() {
		return "Offerta [idOfferta=" + idOfferta + ", prezzoProposto=" + prezzoProposto + ", dataOfferta=" + dataOfferta
				+ ", stato=" + stato + ", controfferta=" + controfferta + ", getClass()=" + getClass() + ", hashCode()="
				+ hashCode() + ", toString()=" + super.toString() + "]";
	}

    
}
