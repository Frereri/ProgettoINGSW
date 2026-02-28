package com.example.demo.models;

import java.util.List;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name="immobile")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(
		name="tipo_immobile",  
		discriminatorType = DiscriminatorType.STRING
		)
public abstract class Immobile {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_immobile")
    private Integer idImmobile;

    @Column(name = "titolo", nullable = false, length = 150)
    private String titolo;

    @Column(name = "citta", nullable = false, length = 100)
    private String citta;

    @Column(name = "provincia", length = 100)
    private String provincia;

    @Column(name = "indirizzo", nullable = false, length = 200)
    private String indirizzo;

    @Column(name = "prezzo", nullable = false)
    private double prezzo;

    @Column(name = "descrizione", columnDefinition = "TEXT")
    private String descrizione;

    @Column(name = "numero_stanze")
    private Integer numeroStanze;

    @Column(name = "classe_energetica", length = 5)
    private String classeEnergetica;
    
    @Column(name = "tipo_contratto")
    private String tipoContratto;

    @Column(name = "tipo_affitto")
    private String tipoAffitto;  

    @Column(name = "superficie" , nullable = false)
    private double superficie;

    @Column(name = "stato")
    private String stato = "DISPONIBILE";
    
    @Column(name = "numero_letti")
    private Integer numeroLetti;

    @Column(name = "numero_bagni")
    private Integer numeroBagni;

    @Column(name = "climatizzazione")
    private boolean climatizzazione = false;

    @Column(name = "boxauto")
    private boolean boxAuto = false;
    
    @Column(name = "terrazzo")
    private boolean terrazzo = false;

    @Column(name = "latitudine")
    private Double latitudine;

    @Column(name = "longitudine")
    private Double longitudine;

    @Column(name = "vicino_scuole")
    private boolean vicinoScuole = false;

    @Column(name = "vicino_parchi")
    private boolean vicinoParchi = false;

    @Column(name = "vicino_trasporti")
    private boolean vicinoTrasporti = false; 

    @ManyToOne
    @JoinColumn(name = "id_agenzia", nullable = false)
    private Agenzia agenzia;

    @ManyToOne
    @JoinColumn(name = "id_agente", nullable = false)
    @NotFound(action = NotFoundAction.IGNORE)
    private Agente agente;
    
    @OneToMany(mappedBy = "immobile")
    private List<Offerta> offerte;

	public Immobile() {
		
	}

	public Immobile(Integer idImmobile, String titolo, String citta, String provincia, String indirizzo, double prezzo,
			String descrizione, Integer numeroStanze, String classeEnergetica, String tipoContratto, String tipoAffitto,
			double superficie, String stato, Integer numeroLetti, Integer numeroBagni, boolean climatizzazione,
			boolean boxAuto, boolean terrazzo, Double latitudine, Double longitudine, boolean vicinoScuole,
			boolean vicinoParchi, boolean vicinoTrasporti, Agenzia agenzia, Agente agente, List<Offerta> offerte) {
		super();
		this.idImmobile = idImmobile;
		this.titolo = titolo;
		this.citta = citta;
		this.provincia = provincia;
		this.indirizzo = indirizzo;
		this.prezzo = prezzo;
		this.descrizione = descrizione;
		this.numeroStanze = numeroStanze;
		this.classeEnergetica = classeEnergetica;
		this.tipoContratto = tipoContratto;
		this.tipoAffitto = tipoAffitto;
		this.superficie = superficie;
		this.stato = stato;
		this.numeroLetti = numeroLetti;
		this.numeroBagni = numeroBagni;
		this.climatizzazione = climatizzazione;
		this.boxAuto = boxAuto;
		this.terrazzo = terrazzo;
		this.latitudine = latitudine;
		this.longitudine = longitudine;
		this.vicinoScuole = vicinoScuole;
		this.vicinoParchi = vicinoParchi;
		this.vicinoTrasporti = vicinoTrasporti;
		this.agenzia = agenzia;
		this.agente = agente;
		this.offerte = offerte;
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

	public Agenzia getAgenzia() {
		return agenzia;
	}

	public void setAgenzia(Agenzia agenzia) {
		this.agenzia = agenzia;
	}

	public Agente getAgente() {
		return agente;
	}

	public void setAgente(Agente agente) {
		this.agente = agente;
	}

	public List<Offerta> getOfferte() {
		return offerte;
	}

	public void setOfferte(List<Offerta> offerte) {
		this.offerte = offerte;
	}

	
}
