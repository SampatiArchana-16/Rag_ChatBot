import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import API from "../api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import Message from "../components/Message";

function Chatbot() {

  const navigate = useNavigate();

  const [messages, setMessages] =
    useState([]);

  const [prompt, setPrompt] =
    useState("");
  const [uploadedFiles, setUploadedFiles] =
    useState([]);

  const loadHistory = async () => {

    try {

      const username =
        localStorage.getItem(
          "username"
        );

      const response =
        await API.get(
          `/history/${username}`
        );

      const history =
        response.data.map(
          (item) => ({
            role: item.role,
            content: item.message
          })
        );

      setMessages(
        history
      );

    } catch (error) {

      console.log(error);

    }
  };


  // -------------------
  // Check Login
  // -------------------

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {

      navigate("/login");

      return;
    }

    loadHistory();

  }, []);

  // -------------------
  // Upload PDFs
  // -------------------

  const uploadPDFs = async (
    event
  ) => {

    const files =
      event.target.files;

    const formData =
      new FormData();

    for (
      let i = 0;
      i < files.length;
      i++
    ) {

      formData.append(
        "files",
        files[i]
      );
    }

    try {

      const response =
        await API.post(
          "/upload-pdf",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      console.log(
        response.data
      );

      const fileNames = [];

      for (
        let i = 0;
        i < files.length;
        i++
      ) {

        fileNames.push(
          files[i].name
        );

      }

      setUploadedFiles(
        (prev) => [
          ...prev,
          ...fileNames
        ]
      );

      alert(
        "PDF Uploaded Successfully"
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail ||
        "Upload Failed"
      );
    }
  };



  // -------------------
  // Chat
  // -------------------

  const sendMessage =
    async () => {

      if (!prompt.trim()) {
        return;
      }

      const userMessage = {
        role: "user",
        content: prompt,
      };

      setMessages(
        (prev) => [
          ...prev,
          userMessage,
        ]
      );

      try {

        const response =
          await API.post("/chat", {
            username: localStorage.getItem("username"),
            prompt,
          });

        const aiMessage = {
          role: "assistant",
          content:
            response.data.answer,
        };

        setMessages(
          (prev) => [
            ...prev,
            aiMessage,
          ]
        );

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data?.detail ||
          "Chat Error"
        );
      }

      setPrompt("");
    };

  const startNewChat = () => {

    setMessages([]);

  };
  // -------------------
  // Logout
  // -------------------

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "username"
    );

    navigate("/login");
  };

  // -------------------
  // UI
  // -------------------

  return (

    <>

      <Navbar />

      <div className="chat-layout">

        <Sidebar
          messages={messages}
          uploadedFiles={uploadedFiles}
          onFileUpload={uploadPDFs}
         
          startNewChat={startNewChat}
        />
        <div className="chat-container">

          <h1>
            AI PDF RAG Chatbot
          </h1>

          {messages.length === 0 && (

            <div
              style={{
                background: "#f3f4f6",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
                textAlign: "center"
              }}
            >
              <h3>
                👋 Welcome
              </h3>

              <p>
                Upload a PDF and start asking questions.
              </p>

            </div>

          )}

          {
            messages.map(
              (msg, index) => (

                <Message
                  key={index}
                  role={msg.role}
                  content={msg.content}
                />

              )
            )
          }

          <div className="chat-input">
  <textarea
    value={prompt}
    placeholder="Ask anything..."
    onChange={(e) => setPrompt(e.target.value)}
  />

  <button onClick={sendMessage}>
    ➤
  </button>
</div>

        </div>

      </div>

    </>

  );
}

export default Chatbot;


