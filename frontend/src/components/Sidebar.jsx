function Sidebar({
  messages,
  uploadedFiles,
  onFileUpload,
  logout,
  startNewChat
}) {

  const username =
    localStorage.getItem(
      "username"
    );

  return (

    <div className="sidebar">

      <button
  onClick={startNewChat}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }}
>
  ➕ New Chat
</button>

      <p>
        Messages:
        {messages.length}
      </p>

      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={onFileUpload}
      />

      <h3>
        📄 Uploaded PDFs
      </h3>

      {
        uploadedFiles.length === 0
          ? (
            <p>
              No PDFs uploaded
            </p>
          )
          : (
            <ul>
              {
                uploadedFiles.map(
                  (file, index) => (
                    <li key={index}>
                      {file}
                    </li>
                  )
                )
              }
            </ul>
          )
      }



    </div>
  );
}

export default Sidebar;