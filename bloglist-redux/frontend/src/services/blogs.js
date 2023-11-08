import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newBlog) => {
  const request = axios.post(baseUrl, newBlog, {
    headers: {
      Authorization: token,
    },
  });

  return request.then((response) => response.data);
};

const likeBlog = (blog) => {
  const request = axios.put(
    `${baseUrl}/${blog.id}`,
    {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return request.then((response) => response.data);
};

const deleteBlog = (blogId) => {
  const request = axios.delete(`${baseUrl}/${blogId}`, {
    headers: {
      Authorization: token,
    },
  });

  return request;
};

export default { getAll, setToken, create, likeBlog, deleteBlog };
