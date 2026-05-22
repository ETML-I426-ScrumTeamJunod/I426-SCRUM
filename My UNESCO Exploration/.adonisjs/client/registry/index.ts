/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'details': {
    methods: ["GET","HEAD"],
    pattern: '/sites/:id/details',
    tokens: [{"old":"/sites/:id/details","type":0,"val":"sites","end":""},{"old":"/sites/:id/details","type":1,"val":"id","end":""},{"old":"/sites/:id/details","type":0,"val":"details","end":""}],
    types: placeholder as Registry['details']['types'],
  },
  'site.image': {
    methods: ["GET","HEAD"],
    pattern: '/sites/:id/image',
    tokens: [{"old":"/sites/:id/image","type":0,"val":"sites","end":""},{"old":"/sites/:id/image","type":1,"val":"id","end":""},{"old":"/sites/:id/image","type":0,"val":"image","end":""}],
    types: placeholder as Registry['site.image']['types'],
  },
  'stats': {
    methods: ["GET","HEAD"],
    pattern: '/stats',
    tokens: [{"old":"/stats","type":0,"val":"stats","end":""}],
    types: placeholder as Registry['stats']['types'],
  },
  'wishlist': {
    methods: ["GET","HEAD"],
    pattern: '/wishlist',
    tokens: [{"old":"/wishlist","type":0,"val":"wishlist","end":""}],
    types: placeholder as Registry['wishlist']['types'],
  },
  'visited_sites.toggle': {
    methods: ["POST"],
    pattern: '/api/sites/:id/toggle-visited',
    tokens: [{"old":"/api/sites/:id/toggle-visited","type":0,"val":"api","end":""},{"old":"/api/sites/:id/toggle-visited","type":0,"val":"sites","end":""},{"old":"/api/sites/:id/toggle-visited","type":1,"val":"id","end":""},{"old":"/api/sites/:id/toggle-visited","type":0,"val":"toggle-visited","end":""}],
    types: placeholder as Registry['visited_sites.toggle']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
