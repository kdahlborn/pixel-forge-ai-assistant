import { Router } from 'express';
import { invokeAssistant } from '../ai/assistant.ai.js';
import { chain, llmRoutingChain } from '../ai/chains.ai.js';
import { getDocumentLinks } from '../services/document.service.js';

const router = Router();

router.post('/', async (req, res) => {
    const { question, history = [] } = req.body;
    console.log('QUESTION:', question);

    const { route } = await llmRoutingChain.invoke({
        history,
        question,
    });
    console.log('ROUTE:', route);

    let answer = '';
    let documents = [];
    let cart = [];

    if (route === 'rag') {
        const response = await chain.invoke({ history, question });
        answer = response.answer;
        documents = await getDocumentLinks(response.documents);
    } else {
        const response = await invokeAssistant(question, history);
        answer = response.content;
        cart = response.cartActions;
    }

    res.json({ answer, documents, cart });
});

export default router;
