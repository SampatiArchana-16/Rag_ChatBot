import os

from fastapi import (
    FastAPI,
    HTTPException,
    UploadFile,
    File
)

from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

from pydantic import BaseModel

from openai import OpenAI

from pypdf import PdfReader

from langchain.text_splitter import (
    RecursiveCharacterTextSplitter
)

from langchain_openai import (
    OpenAIEmbeddings
)

from langchain_community.vectorstores import (
    FAISS
)

from database import (
    engine,
    Base
)

from crud import (
    create_user,
    authenticate_user,
    save_message,
    load_history
)

from auth_jwt import (
    create_access_token
)

# -----------------------------
# Load ENV
# -----------------------------

load_dotenv()

client = OpenAI(
    api_key=os.getenv(
        "OPENAI_API_KEY"
    )
)

# -----------------------------
# Create Tables
# -----------------------------

Base.metadata.create_all(
    bind=engine
)

# -----------------------------
# FastAPI App
# -----------------------------

app = FastAPI()

# -----------------------------
# Global Vector Store
# -----------------------------

vector_store = None

# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# -----------------------------
# Models
# -----------------------------

class AuthRequest(BaseModel):
    username: str
    password: str


class ChatRequest(BaseModel):
    username: str
    prompt: str


# -----------------------------
# Register
# -----------------------------

@app.post("/register")
def register(data: AuthRequest):

    success = create_user(
        data.username,
        data.password
    )

    if not success:

        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    return {
        "message":
        "Registration Successful"
    }


# -----------------------------
# Login
# -----------------------------

@app.post("/login")
def login(data: AuthRequest):

    user = authenticate_user(
        data.username,
        data.password
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )

    token = create_access_token(
        {
            "sub": data.username
        }
    )

    return {
        "message": "Login Successful",
        "token": token
    }


# -----------------------------
# Upload PDFs
# -----------------------------

@app.post("/upload-pdf")
async def upload_pdf(
    files: list[UploadFile] = File(...)
):

    global vector_store

    all_text = ""

    for file in files:

        pdf_reader = PdfReader(
            file.file
        )

        for page in pdf_reader.pages:

            text = page.extract_text()

            if text:

                all_text += (
                    text + "\n"
                )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_text(
        all_text
    )

    embeddings = OpenAIEmbeddings(
        api_key=os.getenv(
            "OPENAI_API_KEY"
        )
    )

    vector_store = FAISS.from_texts(
        chunks,
        embeddings
    )

    vector_store.save_local(
        "vector_store"
    )

    return {
        "message":
        "PDF uploaded successfully",
        "chunks":
        len(chunks)
    }


# -----------------------------
# Chat
# -----------------------------

@app.post("/chat")
def chat(data: ChatRequest):

    global vector_store

    if vector_store is None:

        try:

            embeddings = OpenAIEmbeddings(
                api_key=os.getenv(
                    "OPENAI_API_KEY"
                )
            )

            vector_store = FAISS.load_local(
                "vector_store",
                embeddings,
                allow_dangerous_deserialization=True
            )

        except:

            raise HTTPException(
                status_code=400,
                detail="Upload PDF first"
            )

    # Save User Message

    save_message(
        data.username,
        "user",
        data.prompt
    )

    # ---------------------
    # Summary Mode
    # ---------------------

    if data.prompt.lower() in [

        "analyse pdf",
        "analyze pdf",
        "summarize pdf",
        "summary",
        "explain pdf",
        "summarize the pdf"

    ]:

        docs = vector_store.similarity_search(
            "",
            k=20
        )

    else:

        docs = vector_store.similarity_search(
            data.prompt,
            k=5
        )

    context = ""

    retrieved_chunks = []

    for doc in docs:

        retrieved_chunks.append(
            doc.page_content
        )

        context += (
            doc.page_content +
            "\n\n"
        )

    final_prompt = f"""
You are an expert PDF assistant.

Use ONLY the context below.

CONTEXT:
{context}

QUESTION:
{data.prompt}

RULES:

1. Answer only from context.
2. Do not make up information.
3. If user asks True/False,
verify from context.
4. If user asks to summarize,
provide summary.
5. If answer not found say:

I couldn't find this information in the PDF.
"""

    response = client.chat.completions.create(

        model="gpt-4o-mini",

        messages=[
            {
                "role": "user",
                "content": final_prompt
            }
        ]
    )

    answer = (
        response
        .choices[0]
        .message
        .content
    )

    # Save AI Message

    save_message(
        data.username,
        "assistant",
        answer
    )

    return {
        "answer": answer,
        "sources": retrieved_chunks
    }


# -----------------------------
# Load Chat History
# -----------------------------

@app.get("/history/{username}")
def get_history(
    username: str
):

    history = load_history(
        username
    )

    return [

        {
            "role": item.role,
            "message": item.message
        }

        for item in history

    ]