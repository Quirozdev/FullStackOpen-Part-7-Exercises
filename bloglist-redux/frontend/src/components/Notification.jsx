const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`notification ${message.type}`}>
      <p>{message.text}</p>
    </div>
  );
};

export default Notification;
