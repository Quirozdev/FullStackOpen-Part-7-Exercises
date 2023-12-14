import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAll } from '../services/users';

const Users = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getAll().then((users) => {
      setUsers(users);
    });
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.username}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
