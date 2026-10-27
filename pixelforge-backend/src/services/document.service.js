let cachedDocuments = null;

export const fetchDocuments = async () => {
    if (cachedDocuments) return cachedDocuments;

    const response = await fetch(
        'https://santosnr6.github.io/Data/pixelforgedocuments.json',
    );

    if (!response.ok) {
        throw new Error(
            'Något gick fel vid API-anropet för supportdokument i backend',
        );
    }

    cachedDocuments = await response.json();

    return cachedDocuments;
};

export const getDocumentLinks = async (documents) => {
    const allDocuments = await fetchDocuments();

    return documents
        .map((document) => {
            // Plockar ut filnamnet
            const source = document.metadata?.source;

            if (!source) return null;

            // Plockar ut dokument-ID från filnamnet
            const documentId = source.split('_')[0];

            // Matchar mot dokumentregistret
            const matchingDocument = allDocuments.find(
                (item) => item.id === documentId,
            );

            if (!matchingDocument) return null;

            // Bygger länkobjektet
            const { id, title, slug } = matchingDocument;

            return {
                id,
                title,
                slug,
                url: `/support/${slug}`,
            };
        })
        .filter(Boolean); // Rensar bort ogiltiga resultat
};
