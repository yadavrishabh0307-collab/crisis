import * as React from 'react';

import { renderHook } from '../../../../../tests/utils';
import { useFieldHint } from '../InputRenderer';

import type { Schema } from '@strapi/types';

describe('useFieldHint', () => {
  it('includes the divider when minimum is 0 and maximum is a positive number', () => {
    const attribute = {
      type: 'integer',
      min: 0,
      max: 3,
    } as unknown as Schema.Attribute.AnyAttribute;

    const { result } = renderHook(() => useFieldHint(undefined, attribute));

    const content = React.Children.toArray(result.current)
      .map((child) => (typeof child === 'string' ? child : ''))
      .join('');

    expect(content).toContain('min. 0');
    expect(content).toContain('max. 3');
    expect(content).toContain(' / ');
  });

  it('includes the divider when minimum and maximum are both positive', () => {
    const attribute = {
      type: 'integer',
      min: 1,
      max: 5,
    } as unknown as Schema.Attribute.AnyAttribute;

    const { result } = renderHook(() => useFieldHint(undefined, attribute));

    const content = React.Children.toArray(result.current)
      .map((child) => (typeof child === 'string' ? child : ''))
      .join('');

    expect(content).toContain('min. 1 / max. 5');
  });

  it('omits the divider when only minimum is specified', () => {
    const attribute = {
      type: 'integer',
      min: 0,
    } as unknown as Schema.Attribute.AnyAttribute;

    const { result } = renderHook(() => useFieldHint(undefined, attribute));

    const content = React.Children.toArray(result.current)
      .map((child) => (typeof child === 'string' ? child : ''))
      .join('');

    expect(content).toContain('min. 0');
    expect(content).not.toContain(' / ');
    expect(content).not.toContain('max.');
  });
});
