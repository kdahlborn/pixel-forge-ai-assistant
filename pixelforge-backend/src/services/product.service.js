let cachedProducts = null;

// Hämtar och cachar produkterna i serverns minne
export const fetchProducts = async () => {
    if (cachedProducts) return cachedProducts;

    const response = await fetch(
        'https://santosnr6.github.io/Data/pixelforgeproducts.json',
    );

    if (!response.ok) {
        throw new Error(
            'Något gick fel vid API-anropet för produkter i backend',
        );
    }

    cachedProducts = await response.json();
    return cachedProducts;
};

// Anpassad filtrering för getProducts
// export const searchProducts = async (query) => {
//     const products = await fetchProducts();

//     const searchTerm = query.toLowerCase().trim();

//     return products.filter((product) => {
//         const searchableText = [
//             product.name,
//             product.category,
//             product.brand,
//             product.badge,
//         ]
//             .filter(Boolean)
//             .join(' ')
//             .toLowerCase();

//         return searchableText.includes(searchTerm);
//     });
// };

export const searchProducts = async (query = '') => {
    const products = await fetchProducts();

    const cleanQuery = (query || '').toLowerCase().trim();

    // Om sökfrågan är tom, returnera alla produkter direkt
    if (!cleanQuery) return products;

    // Dela upp söktermen i enskilda ord (t.ex. ["amd", "ryzen"])
    const queryWords = cleanQuery.split(/\s+/);

    const filtered = products.filter((product) => {
        const searchableText = [
            product.name,
            product.category,
            product.brand,
            product.badge,
            product.description,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        // Alla ord i sökfrågan måste finnas med i texten (i valfri ordning)
        return queryWords.every((word) => searchableText.includes(word));
    });

    return filtered;
};
