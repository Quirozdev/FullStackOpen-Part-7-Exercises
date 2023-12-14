import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogs';

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  console.log(blog);

  useEffect(() => {
    blogService.getSpecificBlog(id).then((blog) => {
      setBlog(blog);
    });
  }, [id]);

  async function handleLike() {
    const likedBlog = await blogService.likeBlog(blog);
    setBlog({ ...blog, likes: likedBlog.likes });
  }

  async function handleAddComment(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const comment = formData.get('comment');
    const commentedBlog = await blogService.addComment(blog.id, comment);
    setBlog(commentedBlog);
  }

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={`${blog.url}`}>{blog.url}</a>
      <p>{blog.likes} likes</p>
      <button onClick={handleLike}>like</button>
      <p>added by {blog.author}</p>
      <h4>comments</h4>
      <form onSubmit={handleAddComment}>
        <input type="text" id="comment" name="comment" minLength={3} required />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          blog.comments.map((comment) => {
            return <li key={comment.id}>{comment.text}</li>;
          })
        )}
      </ul>
    </div>
  );
};

export default BlogPage;
