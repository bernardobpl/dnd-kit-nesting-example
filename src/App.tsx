import {useCallback, useMemo, useState} from 'react';
import {
  DndContext, 
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {SortableItem} from './SortableItem';
import './App.css';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

const ORDER: Array<string | GroupItemT> = [
  ['group-1', ['view-2','view-1','view-3', ]],
  ['group-2', []], 
  'view-4', 
];

const VIEWS = {
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
}
const VIEW_GROUPS = {
  'group-1': {
    id: 'group-1',
    title: 'Group 1',
  },
  'group-2': {
    id: 'group-2',
    title: 'Group 2',
  },
}

type ViewT = {
  id: string
  title: string
}

type ViewGroupT = {
  id: string
  title: string
}

type SortEventItemT = {
  containerId: string
  index: number
  items: string[]
}
type GroupItemT = [string, string[]]
const isGroup = (value: string | GroupItemT) => Array.isArray(value)

export default function App() {
  const [dbOrder, setDbOrder] = useState(ORDER);
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [root, setRoot] = useState(() => dbOrder.map((value) => {
    if (typeof value === 'string') {
      return value;
    }
    return value[0] as string
  }));
  const groupContainers: Record<string, string[]> = useMemo(() => {
    const containers: Record<string, string[]> = {}
    const groupItems = dbOrder.filter(value => isGroup(value)) as GroupItemT[]
    groupItems.forEach((value) => {
      const groupId = value[0]
      const viewIds = value[1]
      containers[groupId] = viewIds
    })
    return containers
  }, [dbOrder])

  const [active, setActive] = useState<string | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(PointerSensor));

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const {active, over} = event;

    console.log("🚀 ~ handleDragEnd ~ active:", active)
    console.log("🚀 ~ handleDragEnd ~ over:", over)
    if(!over || !over.data.current || !active.data.current) return

    const activeData = active.data.current.sortable as SortEventItemT
    const activeId = ''+active.id
    const isActiveFromRoot = activeData.containerId === 'root'
    const isActiveFromGroup = !isActiveFromRoot
    const isActiveGroup = activeId.includes('group')
    const isActiveView = !isActiveGroup

    const overData = over.data.current.sortable as SortEventItemT
    const overId = ''+over.id
    const isOverGroup = overId.includes('group')
    const isOverView = !isOverGroup
    const isOverFromRoot = overData.containerId === 'root'
    const isOverFromGroup = !isOverFromRoot

    const isNotMoving = active.id === over.id
    const isMovingGroupIntoGroup = isActiveGroup && isOverFromGroup
    if(isNotMoving || isMovingGroupIntoGroup) {
      // console.log("🚀 ~ handleDragEnd ~ isMovingGroupIntoGroup:", isMovingGroupIntoGroup)
      // console.log("🚀 ~ handleDragEnd ~ isNotMoving:", isNotMoving)
      return
    }

    const isMovingItemInSameContainer = activeData.containerId === overData.containerId
    if(isMovingItemInSameContainer) {
      console.log("🚀 ~ handleDragEnd ~ isMovingItemInSameContainer:", isMovingItemInSameContainer)
      if(activeData.containerId === 'root') {
        setRoot((items) => {
          const oldIndex = items.indexOf(activeId);
          const newIndex = items.indexOf(overId);
          return arrayMove(items, oldIndex, newIndex);
        });
        return
      }
      setDbOrder((items) => {
        return items.map((value) => {
          if(isGroup(value) && value[0] === activeData.containerId){
            const nestedItems = value[1] as string[]
            return [value[0], arrayMove(nestedItems, activeData.index, overData.index)]
          }
          return value
        })
      });
    }

    const isMovingViewFromGroupToGroup = isActiveView && isActiveFromGroup && isOverView && isOverFromGroup && activeData.containerId !== overData.containerId
    if(isMovingViewFromGroupToGroup) {
      console.log("🚀 ~ handleDragEnd ~ isMovingViewFromGroupToGroup:", isMovingViewFromGroupToGroup)
      setDbOrder((items) => {
        return items.map((value) => {
          if(Array.isArray(value) && value[0] === overData.containerId){
            return [value[0], [...new Set([...value[1], active.id])]]
          }
          if(Array.isArray(value) && value[0] === activeData.containerId){
            return [value[0], value[1].filter((v) => v !== active.id)]
          }
          return value
        })
      });
    }

    const isMovingViewFromGroupToRoot = isActiveView && isActiveFromGroup && isOverFromRoot
    if(isMovingViewFromGroupToRoot) {
      console.log("🚀 ~ handleDragEnd ~ isMovingViewFromGroupToRoot:", isMovingViewFromGroupToRoot)
      setDbOrder((items) => {
        return items.map((value) => {
          if(Array.isArray(value) && value[0] === activeData.containerId){
            return [value[0], value[1].filter((v) => v !== active.id)]
          }
          return value
        })
      });
      setRoot((items) => {
        if(overData.index === 0){
          items.unshift(activeId)
          return items
        }
        items.splice(overData.index-1, 0, activeId)
        return items
      })
    }

    const isMovingViewFromRootToGroup = isActiveView &&isActiveFromRoot && isOverView && isOverFromGroup
    if(isMovingViewFromRootToGroup) {
      console.log("🚀 ~ handleDragEnd ~ isMovingViewFromRootToGroup:", isMovingViewFromRootToGroup)
      setDbOrder((items) => {
        return items.map((value) => {
          if(isGroup(value) && value[0] === overData.containerId){
            const nestedItems = value[1] as string[]
            overData.index === 0 ? nestedItems.unshift(activeId) : nestedItems.splice(overData.index-1, 0, activeId)
            return [value[0], nestedItems]
          }
          return value
        })
      });
      setRoot((items) => items.filter((v) => v !== activeId))
    }

    setActive(null)
  },[dbOrder, root,setDbOrder, setRoot, setActive])

  function handleDragStart(event: DragStartEvent) {
    const {active} = event;
    setActive(String(active.id));
    if((''+active.id).includes('group')) {
      setOpenAccordions([...new Set([...openAccordions, (''+active.id)])])
    }
  }
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext
        id='root' 
        items={root}
        strategy={verticalListSortingStrategy}
      >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#DDD',
          }}>
            {
              root.map((id) => {
                if (id.includes('group')) {
                  const groupOrder = ORDER.find((value) => Array.isArray(value) && value[0] === id) as GroupItemT;
                  const groupId = groupOrder[0];
                  const group = VIEW_GROUPS[groupId];
                  const items = groupContainers[groupId]
                  return (
                      <SortableItem id={groupId} key={groupId} isGroup>
                        <Accordion key={groupId} expanded={openAccordions.includes(groupId)}>
                          <AccordionSummary id={groupId}>
                            {group.title}
                          </AccordionSummary>
                          <AccordionDetails>
                            <SortableContext
                              id={groupId}
                              items={items}
                              strategy={verticalListSortingStrategy}
                            >
                              <div 
                                style={{
                                  height: '100%',
                                  width: '100%',
                                }}
                              >

                              {items.map((viewid) => {
                                const view = VIEWS[viewid]
                                return (
                                  <SortableItem key={view.id} id={view.id}>{view.title}</SortableItem>
                                )
                              })}
                              </div>
                            </SortableContext>
                          </AccordionDetails>
                        </Accordion>
                      </SortableItem>
                    
                  )
                } else {
                  const view = VIEWS[id] || VIEW_GROUPS[id];
                  return <SortableItem key={id} id={id}>{view.title}</SortableItem> 
                }
              })
            }
            <DragOverlay>
              {active && <div style={{border: '1px solid red'}}>{active}</div>}
            </DragOverlay>
          </div>
      </SortableContext>
    </DndContext>
  );
  
  
}

const transformIdToElement = (id: string) => {
  if(VIEWS[id]) {
    return {
      elementType: 'view',
      ...VIEWS[id]
    }
  }
  if(VIEW_GROUPS[id]) {
    return {
      elementType: 'group',
      ...VIEW_GROUPS[id]
    }
  }
  return {
    elementType: null,
  }
}

const canMoveViewIntoGroup = (view: ViewT, group: ViewGroupT, dbOrder: Array<any>) => {
  const freeViewIds = dbOrder.filter((value) => !Array.isArray(value));
  if(freeViewIds.includes(view.id)) {
    return true
  }

  const groupIdsWithViewIds = dbOrder.filter((value) => Array.isArray(value));
  const viewsWithGroups: {[key: string]: string} = {}
  groupIdsWithViewIds.forEach(([groupId, viewIds]) => {
    viewIds.forEach((viewId: string) => {
      viewsWithGroups[viewId] = groupId
    })
  })

  if(viewsWithGroups[view.id] && group.id !== viewsWithGroups[view.id]) {
    return true
  }

  return false
}