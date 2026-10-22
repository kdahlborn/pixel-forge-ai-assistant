import { embeddingModel } from '../config/ollama.config.js';
import { supabase } from '../config/supabase.config.js';

export const retrieveDocuments = async (question) => {
    console.log('STANDALONE:', question);
    const embedding = await embeddingModel.embedQuery(question);

    const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_count: 3,
    });

    console.log('DATA:', data);

    if (error) {
        console.log('ERROR:', error);
        throw error;
    }

    return data;
};
