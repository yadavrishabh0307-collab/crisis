import * as React from 'react';

import { http, HttpResponse } from 'msw';

import { render, server } from '../../../../../../tests/utils';
import { EditView } from '../EditView';

describe('ADMIN | Pages | TRANSFER TOKENS | EditView', () => {
  it('renders create mode with token type selector', async () => {
    const { findByText } = render(<EditView />, {
      initialEntries: ['/settings/transfer-tokens/create'],
    });

    expect(await findByText('Name')).toBeInTheDocument();
    expect(await findByText('Description')).toBeInTheDocument();
    expect(await findByText('Token type')).toBeInTheDocument();
  });

  it('renders edit mode with full access token mapping to Full Access', async () => {
    server.use(
      http.get('/admin/transfer/tokens/:id', () => {
        return HttpResponse.json({
          data: {
            id: 1,
            name: 'Full access token',
            description: 'A full access token',
            createdAt: '2021-11-15T00:00:00.000Z',
            lifespan: null,
            permissions: ['push', 'pull'],
          },
        });
      })
    );

    const { findByText } = render(<EditView />, {
      initialEntries: ['/settings/transfer-tokens/1'],
    });

    expect(await findByText('Full access token')).toBeInTheDocument();
    expect(await findByText('Full Access')).toBeInTheDocument();
  });
});
