# DietiEstates2 - Guida rapida all'avvio

Applicazione full - stack per la gestione di annunci immobiliari.

- **Backend:** Spring Boot 4.0 (Java 17) + PostgreSQL (Supabase) + AWS Cognito  
- **Frontend:** React 19 + Vite 8 + AWS Amplify

---

## Prerequisiti

Java JDK  17 
Maven  3.9+ 
Node.js 22.12.0 

---

## Le due cartelle devono stare **nella stessa directory padre** 
---

Le due cartelle devono trovarsi **nella stessa directory padre**.

---

### Avvio - Metodo 1 (consigliato) Applicazione disponibile su: http://localhost:5173

###  Backend (Spring Boot)

```bash
cd DietiEstates2
./mvnw spring-boot:run
```

### Frontend (Vite + React)

```bash
cd DietiEstatesFrontend2
npm install
npm run dev
```

---
#### Avvio - Metodo 2 build unificata (backend serve anche il frontend) Applicazione disponibile su: http://localhost:8080

```bash
cd DietiEstates2
./mvnw clean package
java -jar target/DietiEstates2-0.0.1-SNAPSHOT.jar
```

