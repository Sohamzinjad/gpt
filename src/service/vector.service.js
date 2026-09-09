import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ 
    apiKey: process.env.PINECONE_API_KEY 
});

// Pass an object with the 'name' property
const gptCloneIndex = pc.index({ name: 'gpt-clone' });

async function createMemory({vectors , metadata , messageId}){
    await gptCloneIndex.upsert({
        vectors,
        metadata,
        ids
    })
}


async function queryMemory({queryVector, limit = 5 , metadata , namespace}){
    const data = await gptCloneIndex.query({
        topK : limit,
        vector: queryVector,
        filter : metadata,
        includeMetadata : true,

    })

    return data.matches
}

module.exports = {
    createMemory,
    queryMemory
}
