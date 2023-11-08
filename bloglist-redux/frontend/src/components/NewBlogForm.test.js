import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewBlogForm from './NewBlogForm';
import userEvent from '@testing-library/user-event';

describe('<NewBlogForm />', () => {
  test('', async () => {
    const newBlog = {
      title: 'testBlog',
      author: 'ahhahaha',
      url: 'waos',
    };

    const user = userEvent.setup();

    const handleCreateNewBlog = jest.fn();

    const { container } = render(
      <NewBlogForm handleCreateNewBlog={handleCreateNewBlog} />
    );

    const titleInput = container.querySelector('[name="title"]');
    const authorInput = container.querySelector('[name="author"]');
    const urlInput = container.querySelector('[name="url"]');

    const saveBlogButton = container.querySelector('.create-blog-btn');

    await user.type(titleInput, newBlog.title);
    await user.type(authorInput, newBlog.author);
    await user.type(urlInput, newBlog.url);

    await user.click(saveBlogButton);

    expect(handleCreateNewBlog.mock.calls).toHaveLength(1);
    expect(handleCreateNewBlog.mock.calls[0][0]).toEqual(newBlog);
  });
});
