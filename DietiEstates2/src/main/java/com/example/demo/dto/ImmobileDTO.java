package com.example.demo.dto;

import java.util.List;
import java.util.UUID;


public class ImmobileDTO {

    private Integer idImmobile;
    private String titolo;
    private String citta;
    private String provincia;
    private String indirizzo;
    private double prezzo;
    private String descrizione;
    private Integer numeroStanze;
    private String classeEnergetica;
    private String tipoImmobile;
    private String tipoContratto;
    private String tipoAffitto;
    private double superficie;
    private String stato;
    private Integer numeroLetti;
    private Integer numeroBagni;
    private boolean climatizzazione;
    private boolean boxAuto;
    private boolean terrazzo;
    private Integer piano;
    private boolean ascensore;
    private boolean portineria;
    private boolean giardino;
    private boolean piscina;
    private double superficieGiardino;
    private Double latitudine;
    private Double longitudine;
    private boolean vicinoScuole;
    private boolean vicinoParchi;
    private boolean vicinoTrasporti;
    private Integer idAgenzia;
    private String nomeAgenzia;
    private UUID idAgente;
    private String nomeAgente;
    private List<ImmobileImmagineDTO> immagini;
    private String urlImmagineCopertina;
    
	public ImmobileDTO() {
	    // Costruttore vuoto richiesto per la deserializzazione JSON
	}

	public Integer getIdImmobile() {
		return idImmobile;
	}

	public void setIdImmobile(Integer idImmobile) {
		this.idImmobile = idImmobile;
	}

	public String getTitolo() {
		return titolo;
	}

	public void setTitolo(String titolo) {
		this.titolo = titolo;
	}

	public String getCitta() {
		return citta;
	}

	public void setCitta(String citta) {
		this.citta = citta;
	}

	public String getProvincia() {
		return provincia;
	}

	public void setProvincia(String provincia) {
		this.provincia = provincia;
	}

	public String getIndirizzo() {
		return indirizzo;
	}

	public void setIndirizzo(String indirizzo) {
		this.indirizzo = indirizzo;
	}

	public double getPrezzo() {
		return prezzo;
	}

	public void setPrezzo(double prezzo) {
		this.prezzo = prezzo;
	}

	public String getDescrizione() {
		return descrizione;
	}

	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}

	public Integer getNumeroStanze() {
		return numeroStanze;
	}

	public void setNumeroStanze(Integer numeroStanze) {
		this.numeroStanze = numeroStanze;
	}

	public String getClasseEnergetica() {
		return classeEnergetica;
	}

	public void setClasseEnergetica(String classeEnergetica) {
		this.classeEnergetica = classeEnergetica;
	}

	public String getTipoImmobile() {
		return tipoImmobile;
	}

	public void setTipoImmobile(String tipoImmobile) {
		this.tipoImmobile = tipoImmobile;
	}

	public String getTipoContratto() {
		return tipoContratto;
	}

	public void setTipoContratto(String tipoContratto) {
		this.tipoContratto = tipoContratto;
	}

	public String getTipoAffitto() {
		return tipoAffitto;
	}

	public void setTipoAffitto(String tipoAffitto) {
		this.tipoAffitto = tipoAffitto;
	}

	public double getSuperficie() {
		return superficie;
	}

	public void setSuperficie(double superficie) {
		this.superficie = superficie;
	}

	public String getStato() {
		return stato;
	}

	public void setStato(String stato) {
		this.stato = stato;
	}

	public Integer getNumeroLetti() {
		return numeroLetti;
	}

	public void setNumeroLetti(Integer numeroLetti) {
		this.numeroLetti = numeroLetti;
	}

	public Integer getNumeroBagni() {
		return numeroBagni;
	}

	public void setNumeroBagni(Integer numeroBagni) {
		this.numeroBagni = numeroBagni;
	}

	public boolean isClimatizzazione() {
		return climatizzazione;
	}

	public void setClimatizzazione(boolean climatizzazione) {
		this.climatizzazione = climatizzazione;
	}

	public boolean isBoxAuto() {
		return boxAuto;
	}

	public void setBoxAuto(boolean boxAuto) {
		this.boxAuto = boxAuto;
	}

	public boolean isTerrazzo() {
		return terrazzo;
	}

	public void setTerrazzo(boolean terrazzo) {
		this.terrazzo = terrazzo;
	}

	public Integer getPiano() {
		return piano;
	}

	public void setPiano(Integer piano) {
		this.piano = piano;
	}

	public boolean isAscensore() {
		return ascensore;
	}

	public void setAscensore(boolean ascensore) {
		this.ascensore = ascensore;
	}

	public boolean isPortineria() {
		return portineria;
	}

	public void setPortineria(boolean portineria) {
		this.portineria = portineria;
	}

	public boolean isGiardino() {
		return giardino;
	}

	public void setGiardino(boolean giardino) {
		this.giardino = giardino;
	}

	public boolean isPiscina() {
		return piscina;
	}

	public void setPiscina(boolean piscina) {
		this.piscina = piscina;
	}

	public double getSuperficieGiardino() {
		return superficieGiardino;
	}

	public void setSuperficieGiardino(double superficieGiardino) {
		this.superficieGiardino = superficieGiardino;
	}

	public Double getLatitudine() {
		return latitudine;
	}

	public void setLatitudine(Double latitudine) {
		this.latitudine = latitudine;
	}

	public Double getLongitudine() {
		return longitudine;
	}

	public void setLongitudine(Double longitudine) {
		this.longitudine = longitudine;
	}

	public boolean isVicinoScuole() {
		return vicinoScuole;
	}

	public void setVicinoScuole(boolean vicinoScuole) {
		this.vicinoScuole = vicinoScuole;
	}

	public boolean isVicinoParchi() {
		return vicinoParchi;
	}

	public void setVicinoParchi(boolean vicinoParchi) {
		this.vicinoParchi = vicinoParchi;
	}

	public boolean isVicinoTrasporti() {
		return vicinoTrasporti;
	}

	public void setVicinoTrasporti(boolean vicinoTrasporti) {
		this.vicinoTrasporti = vicinoTrasporti;
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

	public UUID getIdAgente() {
		return idAgente;
	}

	public void setIdAgente(UUID idAgente) {
		this.idAgente = idAgente;
	}

	public String getNomeAgente() {
		return nomeAgente;
	}

	public void setNomeAgente(String nomeAgente) {
		this.nomeAgente = nomeAgente;
	}

	public List<ImmobileImmagineDTO> getImmagini() {
		return immagini;
	}

	public void setImmagini(List<ImmobileImmagineDTO> immagini) {
		this.immagini = immagini;
	}

	public String getUrlImmagineCopertina() {
		return urlImmagineCopertina;
	}

	public void setUrlImmagineCopertina(String urlImmagineCopertina) {
		this.urlImmagineCopertina = urlImmagineCopertina;
	}

	
}
