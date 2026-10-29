# PixelForge

En AI-assistent för PixelForge, en fiktiv e-handel med tekniska produkter. Assistenten kan besvara frågor om produkter, priser och lagerstatus, hjälpa användaren att hantera sin kundvagn samt svara på supportfrågor med hjälp av RAG.

## Funktioner

- **Produktsökning:** Hämtar produktinformation från produktkatalogen.
- **Kundvagn:** Kan lägga till och ta bort produkter baserat på användarens instruktioner.
- **Supportassistent:** Använder RAG för att hitta relevant information i supportdokument.
- **Dokumentlänkar:** Visar relevanta supportsidor som källor till AI-assistentens svar.
- **Chatthistorik:** Sparar konversationen lokalt i webbläsaren.

## Förutsättningar

Innan du startar projektet behöver du:

- Node.js och npm.
- Ollama installerat med de modeller som anges i projektets konfiguration.
- Ett Supabase-projekt med nödvändiga tabeller och funktioner konfigurerade.

## Installation

1. Klona projektet.

    ```bash
    git clone <repository-url>
    ```

2. Installera sedan dependencies i respektive projektmapp:

    ```bash
    npm install
    ```

## Miljövariabler

Skapa en `.env`-fil i backendmappen och ange de miljövariabler som används i projektets konfiguration, exempelvis:

| Miljövariabel            | Beskrivning                                              |
| ------------------------ | -------------------------------------------------------- |
| `SUPABASE_URL`           | URL till Supabase-projektet.                             |
| `SUPABASE_KEY`           | Hemlig nyckel till Supabase.                             |
| `OLLAMA_LLM`             | Namnet på språkmodellen som används av AI-assistenten.   |
| `OLLAMA_EMBEDDING_MODEL` | Namnet på modellen som används för att skapa embeddings. |
| `PORT`                   | Porten som backend-servern körs på.                      |

## Initiera supportdokument

Supportfunktionen använder dokument som lagras i Supabase. Innan den kan användas behöver PDF-filerna importeras med projektets seed-script.

1. Kontrollera att Supabase är konfigurerat och att Ollama är igång med rätt embeddingmodell.
2. Kör seed-scriptet från backendens rotmapp:

```bash
npm run seed
```

Scriptet delar upp dokumentens text, skapar embeddings och lagrar resultatet i Supabase. Kontrollera att tabellen `documents` och funktionen `match_documents` finns innan du kör scriptet.

## Starta projektet

Starta frontend och backend i separata terminaler genom att gå till respektive projektmapp och köra:

```bash
npm run dev
```
