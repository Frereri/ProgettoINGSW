package com.example.demo.services;

import java.util.List;
import java.util.Map;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service 
public class GeoService {
	
	private final String API_KEY = "2b9e7d9b61b2465fbabf2ac1adf7014a";
    private final RestTemplate restTemplate = new RestTemplate();

    public boolean isNear(Double lat, Double lon, String category) {
        // Usiamo Locale.US per assicurarci che i numeri abbiano il punto (12.5) e non la virgola (12,5)
        // Geoapify vuole: circle:longitudine,latitudine,raggio
        String url = String.format(java.util.Locale.US,
            "https://api.geoapify.com/v2/places?categories=%s&filter=circle:%f,%f,1000&limit=1&apiKey=%s",
            category, lon, lat, API_KEY
        );

        System.out.println("DEBUG POI URL (" + category + "): " + url);

        try {
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                null, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            Map<String, Object> response = responseEntity.getBody();
            if (response != null && response.containsKey("features")) {
                List<?> features = (List<?>) response.get("features");
                return !features.isEmpty();
            }
        } catch (Exception e) {
            System.err.println("Errore Geoapify POI (" + category + "): " + e.getMessage());
        }
        return false;
    }
    

    public Map<String, Double> getCoordinates(String address) {
        try {
            // Questa riga trasforma "Via Labicana 125, Roma" in "Via%20Labicana%20125%2C%20Roma"
            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);
            
            String url = String.format(
                "https://api.geoapify.com/v1/geocode/search?text=%s&apiKey=%s",
                encodedAddress, API_KEY
            );

            System.out.println("DEBUG URL: " + url);
            
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> response = responseEntity.getBody();
            
            // Aggiungiamo un log per vedere cosa risponde l'API
            System.out.println("RISPOSTA API: " + response);

            if (response != null && response.get("features") instanceof List<?> features && !features.isEmpty()) {
                Map<?, ?> firstFeature = (Map<?, ?>) features.get(0);
                Map<?, ?> geometry = (Map<?, ?>) firstFeature.get("geometry");
                
                @SuppressWarnings("unchecked")
                List<Double> coordinates = (List<Double>) geometry.get("coordinates");
                
                // GeoJSON restituisce [longitudine, latitudine]
                return Map.of("lon", coordinates.get(0), "lat", coordinates.get(1));
            } else {
                System.out.println("Nessun risultato trovato per l'indirizzo.");
            }
        } catch (Exception e) {
            System.err.println("Errore Geocoding: " + e.getMessage());
            e.printStackTrace(); // Fondamentale per vedere se è un errore 401, 403 o di parsing
        }
        return null;
    }

	public GeoService() {
		// TODO Auto-generated constructor stub
	}

}
