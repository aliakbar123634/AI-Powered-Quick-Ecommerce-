from ai_engine.models import KnowledgeChunk
from ai_engine.services.embedding_service import generate_embedding

def split_text(text, chunk_size=500, overlap=100):
    """
    convert large text into small chunks
    """
    text=text.strip()
    if not text:
        return []
    chunks=[]
    start=0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start = end - overlap
    return chunks       

def create_knowledge_chunks(title,content,source="") :
    chunks=split_text(content)
    created_chunks = []
    for index, chunk in enumerate(chunks):
        embedding = generate_embedding(chunk)
        knowledge_chunk = KnowledgeChunk.objects.create(
            title=f"{title} - Chunk {index + 1}",
            content=chunk,
            embedding=embedding,
            source=source
        )
        created_chunks.append(knowledge_chunk)
    return created_chunks    

