function Message({
  role,
  content,
}) {

  return (

    <div
      className={`message ${role}`}
    >

      <strong>
        {role === "user"
          ? "You"
          : "AI"}
      </strong>

      <p>{content}</p>

    </div>
  );
}

export default Message;