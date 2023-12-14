import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSpecificUser } from '../services/users';

const User = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getSpecificUser(id).then((user) => {
      setUser(user);
    });
  }, [id]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h4>added blogs</h4>
      <ul>
        {user.blogs.length === 0 ? (
          <p>This user has no books published</p>
        ) : (
          user.blogs.map((blog) => {
            return <li key={blog.id}>{blog.title}</li>;
          })
        )}
      </ul>
    </div>
  );
};

export default User;
