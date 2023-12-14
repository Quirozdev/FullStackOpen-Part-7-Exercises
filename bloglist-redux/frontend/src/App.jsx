import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import blogService from './services/blogs';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import { useSelector, useDispatch } from 'react-redux';
import { initializeBlogs } from './reducers/blogReducer';
import { setNotification } from './reducers/notificationReducer';
import { logOut, loginUser } from './reducers/userReducer';
import Users from './components/Users';
import Home from './components/Home';
import User from './components/User';
import BlogPage from './components/BlogPage';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userInfo = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      blogService.setToken(userInfo.token);
    }
  }, [userInfo]);

  async function handleLogin(event) {
    event.preventDefault();
    try {
      await dispatch(loginUser({ username, password })).unwrap();
      dispatch(setNotification('Logged in successfully', 'success', 5));
      setUsername('');
      setPassword('');
    } catch (error) {
      dispatch(setNotification(error, 'error', 5));
    }
  }

  function handleLogout() {
    dispatch(logOut());
    dispatch(setNotification('Logged out successfully', 'success', 5));
  }

  return (
    <div>
      <Notification />
      {userInfo ? (
        <div>
          <Router>
            <Navbar expand="lg" bg="dark" data-bs-theme="dark">
              <Container>
                <Navbar.Brand href="/">Blog App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse
                  id="basic-navbar-nav"
                  className="justify-content-end"
                >
                  <Nav>
                    <Nav.Link href="#" as="span">
                      <Link to="/">Blogs</Link>
                    </Nav.Link>
                    <Nav.Link href="#" as="span">
                      <Link to="/users">Users</Link>
                    </Nav.Link>
                    <Navbar.Text>{userInfo.name} logged in</Navbar.Text>
                    <Button variant="outline-success" onClick={handleLogout}>
                      Log out
                    </Button>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />}></Route>
              <Route path="/users/:id" element={<User />}></Route>
              <Route path="/blogs/:id" element={<BlogPage />}></Route>
            </Routes>
          </Router>
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
