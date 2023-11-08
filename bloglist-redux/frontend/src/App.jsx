import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { useSelector, useDispatch } from 'react-redux';
import { initializeBlogs, createBlog } from './reducers/blogReducer';

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

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
        setMessage({
          text: 'Logged in successfully',
          type: 'success',
        });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        setUsername('');
        setPassword('');
      })
      .catch(() => {
        setMessage({ text: 'wrong username or password', type: 'error' });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
  }

  function handleLogout(event) {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
    setMessage({
      text: 'Logged out successfully',
      type: 'success',
    });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  }

  function handleAddNewBlog(blogObject) {
    dispatch(createBlog(blogObject));
    blogFormRef.current.toggleVisibility();

    // blogService
    //   .create(blogObject)
    //   .then((savedBlog) => {
    //     console.log(savedBlog);
    //     setBlogs(blogs.concat(savedBlog));
    //     blogFormRef.current.toggleVisibility();
    //     setMessage({
    //       text: `a new blog ${savedBlog.title} by ${savedBlog.author} added`,
    //       type: 'success',
    //     });
    //     setTimeout(() => {
    //       setMessage(null);
    //     }, 5000);
    //   })
    //   .catch((error) => {
    //     setMessage({ text: error.response.data.error, type: 'error' });
    //     setTimeout(() => {
    //       setMessage(null);
    //     }, 5000);
    //   });
  }

  function handleLike(blog) {
    blogService
      .likeBlog(blog)
      .then((updatedBlog) => {
        setMessage({
          text: `Blog ${blog.title} liked`,
          type: 'success',
        });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        const newBlogs = blogs.map((blog) => {
          if (blog.id !== updatedBlog.id) {
            return blog;
          }
          return updatedBlog;
        });
        setBlogs(newBlogs);
      })
      .catch((error) => {
        setMessage({ text: error.response.data.error, type: 'error' });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
  }

  function handleBlogDeletion(blogToDelete) {
    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`
      )
    ) {
      blogService
        .deleteBlog(blogToDelete.id)
        .then(() => {
          setMessage({
            text: `${blogToDelete.title} by ${blogToDelete.author} deleted`,
            type: 'success',
          });
          setTimeout(() => {
            setMessage(null);
          }, 5000);
          const blogsAfterDeletion = blogs.filter((blog) => {
            return blog.id !== blogToDelete.id;
          });
          setBlogs(blogsAfterDeletion);
        })
        .catch((error) => {
          setMessage({ text: error.response.data.error, type: 'error' });
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  }

  const blogsSortedByLikes = [...blogs].sort((a, b) => {
    return b.likes - a.likes;
  });

  return (
    <div>
      <Notification message={message} />
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
