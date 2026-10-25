import * as React from 'react';

import { Table, useTable } from '@strapi/admin/strapi-admin';

import { render, screen } from '../../../../../tests/utils';
import { TableActionsBar } from '../../ListViewPage';

jest.mock('../BulkActions/Actions', () => ({
  BulkActionsRenderer: () => <div data-testid="bulk-actions" />,
}));

let currentQuery = { plugins: { i18n: { locale: 'en' } } };

jest.mock('@strapi/admin/strapi-admin', () => {
  const actual = jest.requireActual('@strapi/admin/strapi-admin');
  return {
    ...actual,
    useQueryParams: () => [{ query: currentQuery }],
  };
});

const SelectionDisplay = () => {
  const selectedRows = useTable('SelectionDisplay', (state) => state.selectedRows);
  return <div data-testid="selected-count">{selectedRows.length}</div>;
};

const TestApp = () => {
  return (
    <Table.Root
      defaultSelectedRows={[{ id: 1, documentId: 'doc-1' }]}
      rows={[{ id: 1, documentId: 'doc-1' }]}
      headers={[{ name: 'title', label: 'Title' }]}
    >
      <TableActionsBar />
      <SelectionDisplay />
    </Table.Root>
  );
};

describe('TableActionsBar', () => {
  beforeEach(() => {
    currentQuery = { plugins: { i18n: { locale: 'en' } } };
  });

  it('drops row selection when switching locale', () => {
    const { rerender } = render(<TestApp />);

    expect(screen.getByTestId('selected-count')).toHaveTextContent('1');

    currentQuery = { plugins: { i18n: { locale: 'fr' } } };
    rerender(<TestApp />);

    expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
  });
});
