import os

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

from dotenv import load_dotenv

load_dotenv()


VECTOR_DB_PATH = "vector_store"


def process_pdfs(files):

    all_text = ""

    for file in files:

        pdf_reader = PdfReader(file.file)

        for page in pdf_reader.pages:

            text = page.extract_text()

            if text:

                all_text += text + "\n"

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
        VECTOR_DB_PATH
    )

    return True


def load_vector_store():

    embeddings = OpenAIEmbeddings(
        api_key=os.getenv(
            "OPENAI_API_KEY"
        )
    )

    vector_store = FAISS.load_local(
        VECTOR_DB_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )

    return vector_store