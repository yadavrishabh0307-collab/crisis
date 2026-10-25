import Router from '@koa/router';
import type { Core } from '@strapi/types';
import composeEndpoint from '../compose-endpoint';

describe('compose-endpoint', () => {
  it('correctly resolves controller for single-model API with repeated name', () => {
    const mockController = {
      find: jest.fn(),
    };

    const mockStrapi = {
      controller: jest.fn((uid: string) => {
        if (uid === 'api::about.about') {
          return mockController;
        }
      }),
      get: jest.fn((service: string) => {
        if (service === 'auth') {
          return {
            authenticate: jest.fn((_ctx: unknown, next: () => Promise<unknown>) => next()),
            verify: jest.fn(() => Promise.resolve()),
          };
        }
        if (service === 'policies' || service === 'middlewares') {
          return {
            resolve: jest.fn(() => []),
          };
        }
        return {};
      }),
    } as unknown as Core.Strapi;

    const router = new Router();
    const composer = composeEndpoint(mockStrapi);

    const route = {
      method: 'GET' as const,
      path: '/about',
      handler: 'api::about.about.find',
      config: {},
    };

    expect(() => composer(route, { router })).not.toThrow();
    expect(mockStrapi.controller).toHaveBeenCalledWith('api::about.about');
  });

  it('correctly resolves controller for standard API with different model name', () => {
    const mockController = {
      find: jest.fn(),
    };

    const mockStrapi = {
      controller: jest.fn((uid: string) => {
        if (uid === 'api::blog.post') {
          return mockController;
        }
      }),
      get: jest.fn((service: string) => {
        if (service === 'auth') {
          return {
            authenticate: jest.fn((_ctx: unknown, next: () => Promise<unknown>) => next()),
            verify: jest.fn(() => Promise.resolve()),
          };
        }
        if (service === 'policies' || service === 'middlewares') {
          return {
            resolve: jest.fn(() => []),
          };
        }
        return {};
      }),
    } as unknown as Core.Strapi;

    const router = new Router();
    const composer = composeEndpoint(mockStrapi);

    const route = {
      method: 'GET' as const,
      path: '/posts',
      handler: 'api::blog.post.find',
      config: {},
    };

    expect(() => composer(route, { router })).not.toThrow();
    expect(mockStrapi.controller).toHaveBeenCalledWith('api::blog.post');
  });
});
