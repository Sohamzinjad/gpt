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

export default gptCloneIndex;
