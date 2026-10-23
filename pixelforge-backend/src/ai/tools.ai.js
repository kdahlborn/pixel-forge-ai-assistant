import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { searchProducts } from '../services/product.service.js';

const getProducts = tool(
    async ({ query }) => {
        const products = await searchProducts(query);

        return JSON.stringify(products);
    },
    {
        name: 'get_products',
        description:
            'Sök efter relevanta produkter i PixelForges sortiment. ' +
            'Använd verktyget när användaren frågar om produkter, priser, ' +
            'specifikationer, kategorier, varumärken eller lagerstatus. ' +
            'Skicka en kort sökfråga som beskriver produkten eller dess egenskaper.',
        schema: z.object({
            query: z
                .string()
                .describe('Sökord för att hitta relevanta produkter.'),
        }),
    },
);

export const tools = [getProducts];
