import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from '@langchain/core/prompts';

export const answerPromp = ChatPromptTemplate.fromMessages(
    [
        'system',
        `
        Besvara användaren meddelande kort och koncist. 
    `,
    ],

    new MessagesPlaceholder('history'),

    ['human', '{question}'],
);
