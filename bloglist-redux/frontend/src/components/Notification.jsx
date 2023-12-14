import { useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);
  if (!notification) {
    return null;
  }

  return (
    <Alert variant="success">
      <p>{notification.message}</p>
    </Alert>
  );
};

export default Notification;
