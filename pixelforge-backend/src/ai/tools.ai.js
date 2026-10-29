import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { fetchProducts, searchProducts } from '../services/product.service.js';

const getProducts = tool(
    async ({ query }) => {
        const products = await searchProducts(query);
        return JSON.stringify(products);
    },
    {
        name: 'get_products',
        description: `
            Sök efter produkter som faktiskt finns i PixelForges produktkatalog.

            Du MÅSTE använda verktyget när användaren frågar om produkter,
            produktkategorier, priser, specifikationer, märken eller lagerstatus.

            Exempel:
            - "Har ni Razer-tangentbord?" -> query: "Razer Keyboards"
            - "Vilka moderkort har ni?" -> query: "Motherboards"
            - "Har ni produkter under 3000 kr?" -> sök efter relevant kategori
              och filtrera resultaten efter pris.

            Använd korta engelska sökord. Inkludera inte prisgränser,
            lagerstatus eller andra villkor i sökfrågan.
            Sådana villkor ska hanteras utifrån verktygets resultat.

            Hitta aldrig på produkter eller produktinformation.
        `,
        schema: z.object({
            query: z
                .string()
                .optional()
                .describe(
                    'Kort engelskt sökord för kategori eller märke (t.ex. "Graphics Cards", "AMD").',
                ),
        }),
    },
);

const updateCart = tool(
    async ({ action, items }) => {
        const products = await fetchProducts(); // Hämtar befintliga produkter
        const cartItems = [];

        for (const item of items) {
            const selectedProduct = products.find(
                (product) =>
                    product.name.toLowerCase() ===
                    item.productName.toLowerCase(),
            );

            // Kontrollerar att produkten finns
            if (!selectedProduct) {
                return JSON.stringify({
                    success: false,
                    message: `Produkten ${item.productName} hittades inte.`,
                });
            }

            const { id, name, price, image } = selectedProduct;
            cartItems.push({
                id,
                name,
                price,
                image,
                qty: item.qty,
            });
        }
        return JSON.stringify({
            success: true,
            action,
            items: cartItems,
        });
    },
    {
        name: 'update_cart',
        description: `
            Hantera användarens kundvagn genom att lägga till eller ta bort produkter. 
            
            Använd verktyget när användaren uttryckligen vill ändra sin kundvagn. 
            
            Välj action "add" när användaren vill lägga till produkter. 
            Välj action "remove" när användaren vill ta bort produkter. 
            Använd exakt produktnamn från resultatet av get_products.
            Kopiera namnet från fältet "name" utan att lägga till varumärke,
            tillverkare eller annan text. Om produktens namn är "Ryzen 9 7950X"
            ska productName vara exakt "Ryzen 9 7950X", inte "AMD Ryzen 9 7950X".
        `,
        schema: z.object({
            action: z
                .enum(['add', 'remove'])
                .describe(
                    'add för att lägga till produkter, remove för att ta bort produkter',
                ),
            items: z.preprocess(
                (value) => {
                    if (typeof value === 'string') {
                        try {
                            return JSON.parse(value);
                        } catch {
                            return value;
                        }
                    }

                    return value;
                },
                z
                    .array(
                        z.object({
                            productName: z
                                .string()
                                .describe(
                                    'Produktens exakta namn i produktkatalogen',
                                ),
                            qty: z.coerce
                                .number()
                                .int()
                                .positive()
                                .default(1)
                                .describe('Antal exemplar av produkten'),
                        }),
                    )
                    .min(1),
            ),
        }),
    },
);

export const tools = [getProducts, updateCart];
