package com.example.demo.services;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeoService {

    private static final String API_KEY = "2b9e7d9b61b2465fbabf2ac1adf7014a";
    private final RestTemplate restTemplate;
    private static final Logger logger = Logger.getLogger(GeoService.class.getName());

    public GeoService() {
        this.restTemplate = new RestTemplate();
    }

    public boolean isNear(Double lat, Double lon, String category) {
        if (lat == null || lon == null) return false;
        
        try {
            String url = String.format(Locale.US,
                "https://api.geoapify.com/v2/places?categories=%s&filter=circle:%f,%f,1000&limit=1&apiKey=%s",
                category, lon, lat, API_KEY
            );

            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> response = responseEntity.getBody();

            if (response != null && response.get("features") instanceof List<?> features) {
                return !features.isEmpty();
            }
            return false;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Errore ricerca POI ({0}): {1}", new Object[]{category, e.getMessage()});
            return false;
        }
    }

    public Map<String, Double> getCoordinates(String address) {
        if (address == null || address.isBlank()) return Map.of();

        try {
            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);
            String url = String.format("https://api.geoapify.com/v1/geocode/search?text=%s&apiKey=%s",
                encodedAddress, API_KEY);
            
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> response = responseEntity.getBody();
            
            if (response != null && response.get("features") instanceof List<?> features && !features.isEmpty()) {
                Map<?, ?> firstFeature = (Map<?, ?>) features.get(0);
                Map<?, ?> geometry = (Map<?, ?>) firstFeature.get("geometry");
                
                @SuppressWarnings("unchecked")
                List<Double> coordinates = (List<Double>) geometry.get("coordinates");
                
                return Map.of("lon", coordinates.get(0), "lat", coordinates.get(1));
            } else {
                logger.log(Level.WARNING, "Indirizzo non trovato: {0}", address);
                return Map.of(); 
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Errore critico durante il Geocoding: {0}", e.getMessage());
            return Map.of();
        }
    }
}