
export type ElementTypeT = 'view' | 'group' | 'divider'


export type ViewT = {
  id: string
  title: string
}

export type ViewGroupT = {
  id: string
  title: string
}

export type SortEventItemT = {
  containerId: string
  index: number
  items: string[]
}

export type OrderItemT = {
  id: string
  type: ElementTypeT
  views?: string[]
}

export const ORDER: OrderItemT[] = [
  {
    id: 'view-5',
    type: 'view',
  },
  {
    id: 'group-1',
    type: 'group',
    views: ['view-2','view-1','view-3'],
  },
  {
    id: 'group-2',
    type: 'group',
    views: [],
  },
  {
    id: 'view-4',
    type: 'view',
  }
];

export const VIEWS: Record<string, ViewT> = {
  'view-1': {
    id: 'view-1',
    title: 'View 1',
  },
  'view-2': {
    id: 'view-2',
    title: 'View 2',
  },
  'view-3': {
    id: 'view-3',
    title: 'View 3',
  },
  'view-4': {
    id: 'view-4',
    title: 'View 4',
  },
  'view-5': {
    id: 'view-5',
    title: 'View 5',
  },
  'view-6': {
    id: 'view-6',
    title: 'View 6',
  },
  'view-7': {
    id: 'view-7',
    title: 'View 7',
  },
  'view-8': {
    id: 'view-8',
    title: 'View 8',
  },
}
export const VIEW_GROUPS: Record<string, ViewGroupT> = {
  'group-1': {
    id: 'group-1',
    title: 'Group 1',
  },
  'group-2': {
    id: 'group-2',
    title: 'Group 2',
  },
}