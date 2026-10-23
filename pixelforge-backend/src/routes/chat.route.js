import { Router } from 'express';
import { answerPromp } from '../ai/prompts.ai.js';
import { llm } from '../config/ollama.config.js';

const router = Router();

router.post('/', async (req, res) => {
    const { question, history = [] } = req.body;
    console.log('QUESTION:', question);

    const chain = answerPromp.pipe(llm);

    const answer = await chain.invoke({
        history,
        question,
    });

    res.json({ answer: answer.content });
});

export default router;
