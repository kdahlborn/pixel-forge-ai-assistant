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

// Anpassad sökfunktion för ditt productTool
export const searchProducts = async (query) => {
    const products = await fetchProducts();
    const searchTerm = query.toLowerCase().trim();

    return products.filter((product) => {
        const nameMatch = product.name?.toLowerCase().includes(searchTerm);
        const categoryMatch = product.category
            ?.toLowerCase()
            .includes(searchTerm);
        const brandMatch = product.brand?.toLowerCase().includes(searchTerm);
        const badgeMatch = product.badge?.toLowerCase().includes(searchTerm);

        return nameMatch || categoryMatch || brandMatch || badgeMatch;
    });
};
