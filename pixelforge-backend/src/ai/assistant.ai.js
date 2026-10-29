import { tools } from './tools.ai.js';
import { llm } from '../config/ollama.config.js';
import { ToolMessage } from '@langchain/core/messages';
import { assistantPrompt } from './prompts.ai.js';

// Koppla verktygen till modellen
const llmWithTools = llm.bindTools(tools);

export const invokeAssistant = async (question, history) => {
    // Formatera system-prompten, historiken och den nya frågan
    const messages = await assistantPrompt.formatMessages({
        question,
        history,
    });

    // Spara eventuella varukorgsåtgärder
    const cartActions = [];

    // Låt modellen använda verktyg i flera omgångar
    for (let i = 0; i < 5; i++) {
        // Anropa modellen
        const response = await llmWithTools.invoke(messages);

        console.log('CONTENT:', response.content);
        console.log('TOOL CALLS:', response.tool_calls);

        // Spara modellens svar och eventuella verktygsanrop i konversationen
        messages.push(response);

        // Om modellen inte vill använda något verktyg
        if (!response.tool_calls?.length) {
            return {
                content: response.content,
                cartActions,
            };
        }

        // Kör verktygen som modellen har valt
        for (const toolCall of response.tool_calls) {
            // Hitta rätt verktyg
            const selectedTool = tools.find(
                (tool) => tool.name === toolCall.name,
            );

            if (!selectedTool) {
                throw new Error(`Verktyget ${toolCall.name} hittades inte.`);
            }

            // Kör verktyget med argumenten från modellen
            const result = await selectedTool.invoke(toolCall.args);
            console.log('TOOL RESULT:', result);

            // Spara varukorgsåtgärder
            if (toolCall.name === 'update_cart') {
                const data =
                    typeof result === 'string' ? JSON.parse(result) : result;

                if (data.success) {
                    cartActions.push({
                        action: data.action,
                        items: data.items,
                    });
                }
            }

            // Skicka verktygsresultatet tillbaka till modellen
            messages.push(
                new ToolMessage({
                    content:
                        typeof result === 'string'
                            ? result
                            : JSON.stringify(result),
                    tool_call_id: toolCall.id,
                }),
            );
        }
    }
};
