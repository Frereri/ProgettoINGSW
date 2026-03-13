package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.DTO.RegistrazioneClienteDTO;
import com.example.demo.mapper.IUtenteMapper;
import com.example.demo.models.Cliente;
import com.example.demo.repositories.UtenteRepo;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;



@Service
public class AuthService {

    @Value("${aws.cognito.clientId}")
    private String clientId;

    @Value("${aws.cognito.clientSecret}")
    private String clientSecret;
    
    @Value("${aws.cognito.userPoolId}")
    private String userPoolId;

    private final CognitoIdentityProviderClient cognitoClient;
    
    @Autowired
    private UtenteRepo utenteRepo;
    
    @Autowired
    private IUtenteMapper utenteMapper;

    public AuthService(
    	    @Value("${aws.region}") String region,
    	    @Value("${aws.accessKeyId}") String accessKey,
    	    @Value("${aws.secretAccessKey}") String secretKey) {
    	    
    	    this.cognitoClient = CognitoIdentityProviderClient.builder()
    	            .region(Region.of(region))
    	            .credentialsProvider(StaticCredentialsProvider.create(
    	                AwsBasicCredentials.create(accessKey, secretKey)
    	            ))
    	            .build();
    	}
    
//    public AuthService(@Value("${aws.region}") String region) {
//        this.cognitoClient = CognitoIdentityProviderClient.builder()
//                .region(Region.of(region))
//                .build();
//    }

    public String signUp(String email, String password) {
        String secretHash = calculateSecretHash(clientId, clientSecret, email);

        SignUpRequest request = SignUpRequest.builder()
                .clientId(clientId)
                .secretHash(secretHash)
                .username(email)
                .password(password)
                .userAttributes(AttributeType.builder().name("email").value(email).build())
                .build();

        SignUpResponse response = cognitoClient.signUp(request);
        return response.userSub(); // Questo è l'UUID che useremo nel nostro DB
    }
    
    public void registraCliente(RegistrazioneClienteDTO dto) {

    	if (dto.getDatiProfilo() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "I dati del profilo sono obbligatori");
        }
    	
    	String email = dto.getDatiProfilo().getEmail();
    	String sub;
    		try {
    	        sub = this.signUp(email, dto.getPassword());
    	    } catch (UsernameExistsException e) {
    	        throw new RuntimeException("EMAIL_GIA_ESISTENTE");
    	    } catch (InvalidPasswordException e) {
    	        throw new RuntimeException("PASSWORD_NON_VALIDA");
    	    }

        AdminConfirmSignUpRequest confirmRequest = AdminConfirmSignUpRequest.builder()
                .userPoolId(userPoolId)
                .username(dto.getDatiProfilo().getEmail())
                .build();
        
        cognitoClient.adminConfirmSignUp(confirmRequest);
        
        // 2. Aggiunta al gruppo Clienti
        this.addUserToGroup(email, "Clienti");

        // 3. Salvataggio nel DB locale
        Cliente cliente = utenteMapper.toClienteEntity(dto.getDatiProfilo());
        cliente.setIdUtente(UUID.fromString(sub));
        cliente.setRuolo("CLIENTE");
        
        utenteRepo.save(cliente);
    }
    
    public void addUserToGroup(String email, String groupName) {
        AdminAddUserToGroupRequest groupRequest = AdminAddUserToGroupRequest.builder()
                .userPoolId(userPoolId)
                .username(email)
                .groupName(groupName)
                .build();
        cognitoClient.adminAddUserToGroup(groupRequest);
    }
    
    public String adminCreateUser(String email) {
        AdminCreateUserRequest request = AdminCreateUserRequest.builder()
                .userPoolId(userPoolId)
                .username(email)
                .userAttributes(
                    AttributeType.builder().name("email").value(email).build(),
                    AttributeType.builder().name("email_verified").value("true").build()
                )
                .messageAction(MessageActionType.SUPPRESS)
                .build();

        AdminCreateUserResponse response = cognitoClient.adminCreateUser(request);
        
        this.setUserPasswordPermanent(email, "DefaultPass123!");
        return response.user().attributes().stream()
                .filter(a -> a.name().equals("sub"))
                .findFirst()
                .get().value();
    }

    private String calculateSecretHash(String clientId, String clientSecret, String userName) {
        final String HMAC_SHA256_ALGORITHM = "HmacSHA256";
        SecretKeySpec signingKey = new SecretKeySpec(
                clientSecret.getBytes(StandardCharsets.UTF_8),
                HMAC_SHA256_ALGORITHM);
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256_ALGORITHM);
            mac.init(signingKey);
            mac.update(userName.getBytes(StandardCharsets.UTF_8));
            byte[] rawHmac = mac.doFinal(clientId.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Errore nel calcolo del Secret Hash");
        }
    }
    
    public Map<String, String> login(String email, String password) { // Cambio ritorno in Map
        String secretHash = calculateSecretHash(clientId, clientSecret, email);

        Map<String, String> authParameters = new HashMap<>();
        authParameters.put("USERNAME", email);
        authParameters.put("PASSWORD", password);
        authParameters.put("SECRET_HASH", secretHash);

        AdminInitiateAuthRequest authRequest = AdminInitiateAuthRequest.builder()
                .userPoolId(userPoolId)
                .clientId(clientId)
                .authFlow(AuthFlowType.ADMIN_NO_SRP_AUTH)
                .authParameters(authParameters)
                .build();

        try {
            AdminInitiateAuthResponse response = cognitoClient.adminInitiateAuth(authRequest);
            Map<String, String> tokens = new HashMap<>();
            tokens.put("idToken", response.authenticationResult().idToken());
            tokens.put("accessToken", response.authenticationResult().accessToken());
            
            return tokens; 
        } catch (Exception e) {
            // STAMPA L'ERRORE REALE NELLA CONSOLE DI ECLIPSE
            System.err.println("ERRORE COGNITO LOGIN: " + e.getMessage());
            e.printStackTrace(); 
            
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenziali non valide: " + e.getMessage());
        }
    }
    
    public void confirmUser(String email) {
        AdminConfirmSignUpRequest confirmRequest = AdminConfirmSignUpRequest.builder()
                .userPoolId(userPoolId)
                .username(email)
                .build();

        cognitoClient.adminConfirmSignUp(confirmRequest);
    }
    
    //Per lo Staff (creato tramite adminCreateUser), 
    //non serve il metodo confirmUser usato per i clienti. 
    //Basta impostare la password come "permanente" subito dopo la creazione. 
    //Questo salta lo stato "Force Change Password".
    public void setUserPasswordPermanent(String email, String password) {
        AdminSetUserPasswordRequest request = AdminSetUserPasswordRequest.builder()
                .userPoolId(userPoolId)
                .username(email)
                .password(password)
                .permanent(true)
                .build();

        cognitoClient.adminSetUserPassword(request);
    }
    
    public void updatePassword(String accessToken, String oldPassword, String newPassword) {
        ChangePasswordRequest changePasswordRequest = ChangePasswordRequest.builder()
                .previousPassword(oldPassword)
                .proposedPassword(newPassword)
                .accessToken(accessToken)
                .build();

        cognitoClient.changePassword(changePasswordRequest);
    }
}
