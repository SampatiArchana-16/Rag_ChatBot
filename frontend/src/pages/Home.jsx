import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <h1>AI PDF RAG Chatbot</h1>

        <p>
          Upload PDFs and chat with your
          documents using AI.
        </p>
      </div>
    </>
  );
}

export default Home;