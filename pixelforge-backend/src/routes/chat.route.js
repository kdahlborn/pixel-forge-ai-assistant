import { Router } from 'express';
import { invokeAssistant } from '../ai/assistant.ai.js';

const router = Router();

router.post('/', async (req, res) => {
    const { question, history = [] } = req.body;
    console.log('QUESTION:', question);

    const answer = await invokeAssistant(question, history);

    res.json({ answer: answer.content });
});

export default router;
