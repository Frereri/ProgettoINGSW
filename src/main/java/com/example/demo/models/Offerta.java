package com.example.demo.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Offerta {

    private Long idOfferta;
    private double prezzoProposto;
    private LocalDate dataOfferta;
    private String stato;
    private Double controfferta;
    private List<Double> storicoOfferte;

    public Offerta() {
        this.storicoOfferte = new ArrayList<>();
    }

    public Offerta(Long idOfferta,
                   double prezzoProposto, LocalDate dataOfferta, String stato,
                   Double controfferta) {

        this.idOfferta = idOfferta;
        this.prezzoProposto = prezzoProposto;
        this.dataOfferta = dataOfferta;
        this.stato = stato;
        this.controfferta = controfferta;
        this.storicoOfferte = new ArrayList<>();
        this.storicoOfferte.add(prezzoProposto);
    }


    public Long getIdOfferta() { return idOfferta; }
    public void setIdOfferta(Long id) { this.idOfferta = id; }

    public double getPrezzoProposto() { return prezzoProposto; }
    public void setPrezzoProposto(double prezzo) { this.prezzoProposto = prezzo; }

    public LocalDate getDataOfferta() { return dataOfferta; }
    public void setDataOfferta(LocalDate dataOfferta) { this.dataOfferta = dataOfferta; }

    public String getStato() { return stato; }
    public void setStato(String stato) { this.stato = stato; }

    public Double getControfferta() { return controfferta; }
    public void setControfferta(Double controfferta) { this.controfferta = controfferta; }

    public List<Double> getStoricoOfferte() { return storicoOfferte; }
    public void addStoricoOfferta(Double nuovaOfferta) {
        this.storicoOfferte.add(nuovaOfferta);
    }
}
