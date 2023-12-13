import axios from 'axios';

const login = async (credentials) => {
  const request = axios.post('/api/login', credentials);
  return request.then((response) => response.data);
};

export default login;
