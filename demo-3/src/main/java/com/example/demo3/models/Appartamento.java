package com.example.demo3.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Appartamento")
public class Appartamento extends Immobile {

    @Column(nullable = false)
    private Integer numeroBalconi;

    @Column(nullable = false)
    private boolean cantina;

    public Appartamento() {
        super();
    }
    
	public Appartamento(Long idImmobile, String titolo, String indirizzo, String immagine, String descrizione,
			int dimensioni, double prezzo, String piano, Integer numeroStanze, String classeEnergetica,
			boolean ascensore, boolean portineria, boolean climatizzazione, boolean boxAuto, boolean terrazzo,
			boolean giardino, String tipoAnnuncio, String tipoImmobile, String emailAgente,Integer numeroBalconi, boolean cantina) {
		super(idImmobile, titolo, indirizzo, immagine, descrizione, dimensioni, prezzo, piano, numeroStanze, classeEnergetica,
				ascensore, portineria, climatizzazione, boxAuto, terrazzo, giardino, tipoAnnuncio, tipoImmobile, emailAgente);
		setCantina(cantina);
		setNumeroBalconi(numeroBalconi);
	}
	public Integer getNumeroBalconi() {
		return numeroBalconi;
	}
	public void setNumeroBalconi(Integer numeroBalconi) {
		this.numeroBalconi = numeroBalconi;
	}
	public boolean isCantina() {
		return cantina;
	}
	public void setCantina(boolean cantina) {
		this.cantina = cantina;
	}

    
	
}
