import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

export const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addNewBlog: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { setBlogs, addNewBlog } = blogSlice.actions;

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch(addNewBlog(newBlog));
  };
};

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export default blogSlice.reducer;
