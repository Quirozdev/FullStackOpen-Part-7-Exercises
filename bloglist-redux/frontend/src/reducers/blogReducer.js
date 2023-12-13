import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async (blog, { rejectWithValue }) => {
    try {
      const newBlog = await blogService.create(blog);
      return newBlog;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const likeBlog = createAsyncThunk(
  'blogs/likeBlog',
  async (blog, { rejectWithValue }) => {
    try {
      const likedBlog = await blogService.likeBlog(blog);
      return likedBlog;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (blog, { rejectWithValue }) => {
    try {
      await blogService.deleteBlog(blog.id);
      return blog.id;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBlog.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        const newBlogs = state.map((blog) => {
          if (blog.id !== action.payload.id) {
            return blog;
          }
          return action.payload;
        });
        return newBlogs;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        return state.filter((blog) => {
          return blog.id !== action.payload;
        });
      });
  },
});

export const { setBlogs } = blogSlice.actions;

export default blogSlice.reducer;
