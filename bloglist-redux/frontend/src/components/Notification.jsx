import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);
  if (!notification) {
    return null;
  }

  return (
    <div className={`notification ${notification.type}`}>
      <p>{notification.message}</p>
    </div>
  );
};

export default Notification;
