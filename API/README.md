# Den grønne avis - Svendeprøve API

Dette API skal du bruge i din svendeprøve.
Det fungerer som datagrundlag for dit website, hvor brugere kan se produkter, læse nyheder og skrive kommentarer.

Du skal hente API’et fra det udleverede repository, installere det og køre det lokalt, så din frontend kan hente og sende data.

API’et understøtter funktioner som produktkategorier, produktlister og detaljer og kommentarer.

Du kan tilpasse API’et, hvis det er nødvendigt i din løsning.

---

## Kom i gang

### 1. Klon repo og installér afhængigheder

```bash
git clone [REPO-URL]
cd [MAPPE-NAVN]
```
### 2. Kopier eller omdøb *.env.example* til *.env*

```bash
cp .env.example .env
```
### 3. Installer pakker
```bash
npm install
```
### 4. Generate client
```bash
npm run generate
```
### 5. Start serveren
```bash
npm run dev
```
### 6. Få overblik over data
```bash
npx prisma studio
```
Nu skulle du gerne kunne se en oversigt over dine modeller og data i din browser. Det er Prismas admin-panel til din database.

Klik på en af modellerne til venstre hvis du vil se og redigere data.

## Postman dokumentation
https://documenter.getpostman.com/view/6540576/2sB3HhsMet
