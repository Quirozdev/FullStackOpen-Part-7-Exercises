import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';

const Blog = ({ blog, handleLike, removable, handleBlogDeletion }) => {
  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5,
  // };

  return (
    <Accordion.Item eventKey={`${blog.id}`}>
      <Accordion.Header>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </Accordion.Header>
      <Accordion.Body>
        <div>
          <a
            href={blog.url}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'block' }}
          >
            {blog.url}
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p className="likes" style={{ margin: 2 }}>
              likes {blog.likes}
            </p>
            <button className="like-btn" onClick={() => handleLike(blog)}>
              like
            </button>
          </div>
          <p style={{ margin: 2 }}>{blog.user.username}</p>
          {removable && (
            <button
              className="remove-btn"
              onClick={() => handleBlogDeletion(blog)}
            >
              Remove
            </button>
          )}
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default Blog;
