import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';

describe('<Blog />', () => {
  let container;

  const blog = {
    title: 'testing blogs',
    author: 'unknown',
    url: 'https://cats.com/blog',
    user: {
      username: 'testuser',
    },
  };

  let handleLike;

  const removable = false;

  let handleBlogDeletion;

  beforeEach(() => {
    handleBlogDeletion = jest.fn();
    handleLike = jest.fn();
    container = render(
      <Blog
        blog={blog}
        handleLike={handleLike}
        removable={removable}
        handleBlogDeletion={handleBlogDeletion}
      />
    ).container;
  });
  test('renders title and author, but does not render its URL or number of likes by default', () => {
    const element = screen.getByText(`${blog.title} ${blog.author}`);

    expect(element).toBeDefined();

    const div = container.querySelector('.togglable-content');

    expect(div).toBeNull();
  });

  test("renders blog's URL and number of likes when the button controlling the shown details has been clicked", async () => {
    const user = userEvent.setup();
    const button = container.querySelector('.toggle-btn');
    await user.click(button);

    const div = container.querySelector('.togglable-content');

    expect(div).toBeDefined();
  });

  test('the like event handler is called twice when the like button is clicked twice', async () => {
    const user = userEvent.setup();

    const toggleButton = container.querySelector('.toggle-btn');
    await user.click(toggleButton);

    const likeButton = container.querySelector('.like-btn');

    await user.click(likeButton);
    await user.click(likeButton);

    expect(handleLike.mock.calls).toHaveLength(2);
  });
});
