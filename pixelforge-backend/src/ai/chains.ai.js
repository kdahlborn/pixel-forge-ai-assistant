import { StringOutputParser } from '@langchain/core/output_parsers';
import {
    RunnableSequence,
    RunnablePassthrough,
} from '@langchain/core/runnables';
import {
    standaloneQuestionPrompt,
    answerPrompt,
    routingPrompt,
} from './prompts.ai.js';
import { llm } from '../config/ollama.config.js';
import { retrieveDocuments } from './retriever.ai.js';
import { combineDocuments } from '../utils/combineDocuments.js';
import { routingSchema } from './schemas.ai.js';

export const llmRoutingChain = RunnableSequence.from([
    routingPrompt,
    llm.withStructuredOutput(routingSchema),
]);

// Steg 1. Omvandla frågan till en standalone question
const standaloneQuestionChain = RunnableSequence.from([
    standaloneQuestionPrompt, // Formaterar prompten med historik och ny fråga
    llm, // Skickar till LLM
    new StringOutputParser(), // Konverterar AI-meddelande-objektet till en ren sträng
]);

// Steg 2. Hämta relevant information/kontext från databasen
const retrieverChain = RunnableSequence.from([
    (data) => data.standaloneQuestion, // Plockar ut den omformulerade sökfrågan
    retrieveDocuments, // Gör vektorsökning i Supabase
    // combineDocuments, // Slår ihop alla hittade dokument till en samlad text
]);

// Steg 3. Generera ett svar med hjälp av kontexten
const answerChain = RunnableSequence.from([
    answerPrompt, // Bygger slutgiltiga prompten med kontext + fråga
    llm, // Genererar svaret
    new StringOutputParser(), // Returnerar svaret som en ren sträng
]);

// Steg 4. Den komplette RAG-pipeline-kedjan
export const chain = RunnableSequence.from([
    // Länk 1. Generera sökfrågan samtidigt som originaldatan sparas
    {
        standaloneQuestion: standaloneQuestionChain,
        originalQuestion: new RunnablePassthrough(), // Skickar vidare inkommande { question, history } oförändrat
    },
    // Länk 2. Hämta kontext baserat på standaloneQuestion och förbered objektet för answerChain
    {
        documents: retrieverChain, // Anropar retrieverChain med resultatet från Länk 1
        question: ({ originalQuestion }) => originalQuestion.question,
        history: ({ originalQuestion }) => originalQuestion.history,
    },
    // Länk 3. Omvandla dokumentens innehåll till kontext och behåll dokumentinformationen
    {
        context: ({ documents }) => combineDocuments(documents),
        question: ({ question }) => question,
        history: ({ history }) => history,
        documents: ({ documents }) => documents,
    },
    // Länk 4. Generera svaret och returnera det tillsammans med dokumentinformationen
    {
        answer: answerChain,
        documents: ({ documents }) => documents,
    },
]);
