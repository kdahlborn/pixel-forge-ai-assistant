import { tools } from './tools.ai.js';
import { llm } from '../config/ollama.config.js';
import { ToolMessage } from '@langchain/core/messages';
import { assistantPrompt } from './prompts.ai.js';

// Koppla verktygen till modellen
const llmWithTools = llm.bindTools(tools);

export const invokeAssistant = async (question, history) => {
    // Formatera system-prompten tillsammans med historik och den nya frågan
    const messages = await assistantPrompt.formatMessages({
        question,
        history,
    });

    // Gör det första anropet till LLM:en för att se om den vill svara direkt eller använda ett verktyg
    const response = await llmWithTools.invoke(messages);

    // Om modellen inte begärde några verktygsanrop, returnera svaret direkt till användaren
    if (!response.tool_calls?.length) {
        console.log('Modellen svarar utan verktyg');
        return response;
    }

    // Array för att samla alla resultat från utförda verktyg
    const toolMessages = [];

    // Iterera igenom alla verktygsanrop som modellen begärde
    for (const toolCall of response.tool_calls) {
        // Hitta det matchande verktyget i vår verktygslista baserat på namnet
        const selectedTool = tools.find((tool) => tool.name === toolCall.name);

        if (!selectedTool) {
            throw new Error(`Unkown tool: ${toolCall.name}`);
        }

        console.log('SELECTED TOOL:', selectedTool.name);

        const result = await selectedTool.invoke(toolCall.args);

        // Paketera resultatet i ett ToolMessage så att modellen förstår källan till datan
        toolMessages.push(
            new ToolMessage({
                content: result,
                tool_call_id: toolCall.id,
            }),
        );
    }

    // Skicka tillbaka hela kontexten (ursprungliga meddelanden + modellens verktygsbegäran + verktygens resultat)
    // till modellen så att den kan generera ett slutgiltigt svar till användaren
    return await llmWithTools.invoke([...messages, response, ...toolMessages]);
};
