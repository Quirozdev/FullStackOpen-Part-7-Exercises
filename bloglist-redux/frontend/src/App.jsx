import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { useSelector, useDispatch } from 'react-redux';
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  deleteBlog,
} from './reducers/blogReducer';
import { setNotification } from './reducers/notificationReducer';

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserStr = window.localStorage.getItem('loggedUser');
    if (loggedUserStr) {
      const loggedUser = JSON.parse(loggedUserStr);
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
    }
  }, []);

  function handleLogin(event) {
    event.preventDefault();
    loginService
      .login({
        username,
        password,
      })
      .then((user) => {
        setUser(user);
        blogService.setToken(user.token);
        window.localStorage.setItem('loggedUser', JSON.stringify(user));
        dispatch(setNotification('Logged in successfully', 'success', 5));
        setUsername('');
        setPassword('');
      })
      .catch(() => {
        dispatch(setNotification('Wrong username or password', 'error', 5));
      });
  }

  function handleLogout(event) {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
    dispatch(setNotification('Logged out successfully', 'success', 5));
  }

  async function handleAddNewBlog(blogObject) {
    try {
      await dispatch(createBlog(blogObject)).unwrap();
      dispatch(
        setNotification(
          `a new blog ${blogObject.title} by ${blogObject.author} added`,
          'success',
          5
        )
      );
    } catch (error) {
      dispatch(setNotification(error, 'error', 5));
    }

    blogFormRef.current.toggleVisibility();
  }

  function handleLike(blog) {
    try {
      dispatch(likeBlog(blog)).unwrap();
      dispatch(setNotification(`Blog ${blog.title} liked`, 'success', 5));
    } catch (error) {
      dispatch(setNotification(error, 'error', 5));
    }
  }

  async function handleBlogDeletion(blogToDelete) {
    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`
      )
    ) {
      try {
        await dispatch(deleteBlog(blogToDelete)).unwrap();
        dispatch(
          setNotification(
            `${blogToDelete.title} by ${blogToDelete.author} deleted`,
            'success',
            5
          )
        );
      } catch (error) {
        dispatch(setNotification(error, 'error', 5));
      }
    }
  }

  const blogsSortedByLikes = [...blogs].sort((a, b) => {
    return b.likes - a.likes;
  });

  return (
    <div>
      <Notification />
      {user ? (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Log out</button>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <NewBlogForm handleCreateNewBlog={handleAddNewBlog} />
          </Togglable>
          {blogsSortedByLikes.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              removable={user.username === blog.user.username}
              handleBlogDeletion={handleBlogDeletion}
            />
          ))}
        </div>
      ) : (
        <LoginForm
          handleLogin={handleLogin}
          usernameValue={username}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          passwordValue={password}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        />
      )}
    </div>
  );
};

export default App;
