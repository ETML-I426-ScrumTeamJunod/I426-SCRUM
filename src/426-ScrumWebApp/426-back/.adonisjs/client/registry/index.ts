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
  'stats': {
    methods: ["GET","HEAD"],
    pattern: '/stats',
    tokens: [{"old":"/stats","type":0,"val":"stats","end":""}],
    types: placeholder as Registry['stats']['types'],
  },
  'list': {
    methods: ["GET","HEAD"],
    pattern: '/list',
    tokens: [{"old":"/list","type":0,"val":"list","end":""}],
    types: placeholder as Registry['list']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/user/signup',
    tokens: [{"old":"/user/signup","type":0,"val":"user","end":""},{"old":"/user/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/user/signup',
    tokens: [{"old":"/user/signup","type":0,"val":"user","end":""},{"old":"/user/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/user/login',
    tokens: [{"old":"/user/login","type":0,"val":"user","end":""},{"old":"/user/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/user/login',
    tokens: [{"old":"/user/login","type":0,"val":"user","end":""},{"old":"/user/login","type":0,"val":"login","end":""}],
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
