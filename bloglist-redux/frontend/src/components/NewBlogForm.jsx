import { useState } from 'react';

const NewBlogForm = ({ handleCreateNewBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  function createBlog(event) {
    event.preventDefault();
    handleCreateNewBlog({
      title,
      author,
      url,
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  }

  return (
    <form onSubmit={createBlog}>
      <h2>create new</h2>
      <div>
        title:{' '}
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:{' '}
        <input
          type="text"
          id="author"
          name="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:{' '}
        <input
          type="text"
          id="url"
          name="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button id="create-blog-btn" className="create-blog-btn" type="submit">
        Create
      </button>
    </form>
  );
};

export default NewBlogForm;
