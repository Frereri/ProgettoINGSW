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
	
  public Villa(Long idImmobile, String titolo, String indirizzo, String immagine, String descrizione,
			Integer dimensioni, double prezzo, String piano, Integer numeroStanze, String classeEnergetica,
			boolean ascensore, boolean portineria, boolean climatizzazione, boolean boxAuto, boolean terrazzo,
			boolean giardino, String tipoAnnuncio, String emailAgente, Integer superficiegiardino, boolean piscina) {
		super(idImmobile, titolo, indirizzo, immagine, descrizione, dimensioni, prezzo, piano, numeroStanze, classeEnergetica,
				ascensore, portineria, climatizzazione, boxAuto, terrazzo, giardino, tipoAnnuncio, emailAgente);
		this.superficieGiardino=superficiegiardino;
		this.piscina=piscina;
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

	@Override
	public String toString() {
		return "Villa [superficieGiardino=" + superficieGiardino + ", piscina=" + piscina + ", getIdImmobile()="
				+ getIdImmobile() + ", getTitolo()=" + getTitolo() + ", getIndirizzo()=" + getIndirizzo()
				+ ", getImmagine()=" + getImmagine() + ", getDescrizione()=" + getDescrizione() + ", getDimensioni()="
				+ getDimensioni() + ", getPrezzo()=" + getPrezzo() + ", getPiano()=" + getPiano()
				+ ", getNumeroStanze()=" + getNumeroStanze() + ", getClasseEnergetica()=" + getClasseEnergetica()
				+ ", isAscensore()=" + isAscensore() + ", isPortineria()=" + isPortineria() + ", isClimatizzazione()="
				+ isClimatizzazione() + ", isBoxAuto()=" + isBoxAuto() + ", isTerrazzo()=" + isTerrazzo()
				+ ", isGiardino()=" + isGiardino() + ", getTipoAnnuncio()=" + getTipoAnnuncio() + ", getEmailAgente()="
				+ getEmailAgente() + ", toString()=" + super.toString() + ", getClass()=" + getClass() + ", hashCode()="
				+ hashCode() + "]";
	}
	
	
    
}
