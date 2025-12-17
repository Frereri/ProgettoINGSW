package com.example.demo3.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Villa")
public class Villa extends Immobile {

    @Column(nullable = false)
    private Integer superficieGiardino;

    @Column(nullable = false)
    private boolean piscina;

    public Villa() {
        super();
    }
    
	public Villa(Long idImmobile, String titolo, String indirizzo, String immagine, String descrizione, int dimensioni,
			double prezzo, String piano, Integer numeroStanze, String classeEnergetica, boolean ascensore,
			boolean portineria, boolean climatizzazione, boolean boxAuto, boolean terrazzo, boolean giardino,
			String tipoAnnuncio, String tipoImmobile, String emailAgente,Integer superficieGiardino, boolean piscina) {
		super(idImmobile, titolo, indirizzo, immagine, descrizione, dimensioni, prezzo, piano, numeroStanze, classeEnergetica,
				ascensore, portineria, climatizzazione, boxAuto, terrazzo, giardino, tipoAnnuncio, tipoImmobile, emailAgente);
		setSuperficieGiardino(superficieGiardino);
		setPiscina(piscina);
		
	}
	public Integer getSuperficieGiardino() {
		return superficieGiardino;
	}
	public void setSuperficieGiardino(Integer superficieGiardino) {
		this.superficieGiardino = superficieGiardino;
	}
	public boolean isPiscina() {
		return piscina;
	}
	public void setPiscina(boolean piscina) {
		this.piscina = piscina;
	}

    
}
