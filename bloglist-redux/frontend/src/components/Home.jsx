import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion } from 'react-bootstrap';
import Togglable from './Togglable';
import NewBlogForm from './NewBlogForm';
import Blog from './Blog';
import { createBlog, likeBlog, deleteBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';

const Home = () => {
  const blogs = useSelector((state) => state.blogs);
  const userInfo = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const blogFormRef = useRef();

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
    <Accordion defaultActiveKey={0}>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewBlogForm handleCreateNewBlog={handleAddNewBlog} />
      </Togglable>
      {blogsSortedByLikes.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          removable={userInfo.username === blog.user.username}
          handleBlogDeletion={handleBlogDeletion}
        />
      ))}
    </Accordion>
  );
};

export default Home;
