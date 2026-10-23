import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { searchProducts } from '../services/product.service.js';

export const getProducts = tool(
    async ({ query }) => {
        const result = await searchProducts(query);

        if (!result || result.length === 0) {
            return 'Inga produkter hittades för den angivna sökningen';
        }

        return JSON.stringify(result);
    },
    {
        name: 'get_products',
        description:
            'Använd detta verktyg för att söka i PixelForges produktsortiment efter priser, lagerstatus, betyg, kategorier och varumärken.',
        schema: z.object({
            query: z
                .string()
                .describe(
                    'Sökord eller kategori, t.ex. "Gaming PCs", "Nexus Pro", "Bestseller" eller "PixelForge"',
                ),
        }),
    },
);
