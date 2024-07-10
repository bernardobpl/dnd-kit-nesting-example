import {useState} from 'react';
import {
  DndContext, 
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
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
import { SortableContainer } from './SortableContainer';

type ElementTypeT = 'view' | 'group' | 'divider'

type OrderItemT = {
  id: string
  type: ElementTypeT
  views?: string[]
}
const ORDER: OrderItemT[] = [
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
    views: ['view-6','view-7','view-8'],
  },
  {
    id: 'view-4',
    type: 'view',
  }
];

const VIEWS: Record<string, ViewT> = {
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
const VIEW_GROUPS: Record<string, ViewGroupT> = {
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
export default function App() {
  const [dbOrder, setDbOrder] = useState(ORDER);
  // console.log("🚀 ~ App ~ dbOrder:", JSON.stringify(dbOrder, null, 2))
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [activeDrag, setActiveDrag] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 10}}), useSensor(MouseSensor));
  const rootItemIds = dbOrder.map((item) => item.id)

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    console.log("🚀 ~ handleDragEnd ~ active:", active)
    console.log("🚀 ~ handleDragEnd ~ over:", over)
    if(!over || !over.data.current || !active.data.current) return
    setActiveDrag(null)

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
      console.log("🚀 ~ handleDragEnd ~ isMovingGroupIntoGroup:", isMovingGroupIntoGroup)
      console.log("🚀 ~ handleDragEnd ~ isNotMoving:", isNotMoving)
      return
    }

    const isMovingItemInSameContainer = activeData.containerId === overData.containerId
    if(isMovingItemInSameContainer) {
      console.log("🚀 ~ handleDragEnd ~ isMovingItemInSameContainer:", isMovingItemInSameContainer)
      if(activeData.containerId === 'root') {
        setDbOrder((items) => {
          return arrayMove(items, activeData.index, overData.index);
        });
      } else {
        setDbOrder((items) => {
          return items.map((item) => {
            if(item.id === activeData.containerId){
              return {
                ...item,
                views: arrayMove(item.views || [], activeData.index, overData.index)
              }
            }
            return item
          })
        });
      }
    }

    // const isMovingViewFromGroupToGroup = isActiveView && isActiveFromGroup && isOverView && isOverFromGroup && activeData.containerId !== overData.containerId
    // if(isMovingViewFromGroupToGroup) {
    //   console.log("🚀 ~ handleDragEnd ~ isMovingViewFromGroupToGroup:", isMovingViewFromGroupToGroup)
    //   setDbOrder((items) => {
    //     return items.map((item) => {
    //       if(item.id === overData.containerId){
    //         // return [item[0], [...new Set([...item[1], active.id])]]
    //       }
    //       if(item.id === activeData.containerId){
    //         // return [item[0], item[1].filter((v) => v !== active.id)]
    //       }
    //       return item
    //     })
    //   });
    // }

    // const isMovingViewFromGroupToRoot = isActiveView && isActiveFromGroup && isOverFromRoot
    // if(isMovingViewFromGroupToRoot) {
    //   console.log("🚀 ~ handleDragEnd ~ isMovingViewFromGroupToRoot:", isMovingViewFromGroupToRoot)
    //   setDbOrder((items) => {
    //     const newItems =  items.map((item) => {
    //       if(item.id === activeData.containerId){
    //         const groupViews = item.views || []
    //         return {
    //           ...item,
    //           views: groupViews.filter((v) => v !== active.id)
    //         }
    //       }
    //       return item
    //     })
    //     const newRootView: OrderItemT = {id: activeId, type: 'view'}
    //     overData.index === 0 || over.id === 'root-context'
    //       ? newItems.unshift(newRootView)
    //       : newItems.splice(overData.index-1, 0,newRootView)
    //       return newItems
    //   });
    // }

    // const isMovingViewFromRootToGroup = isActiveView &&isActiveFromRoot && isOverView && isOverFromGroup
    // if(isMovingViewFromRootToGroup) {
    //   console.log("🚀 ~ handleDragEnd ~ isMovingViewFromRootToGroup:", isMovingViewFromRootToGroup)
    //   setDbOrder((items) => {
    //     return items
    //       .filter(item => item.id !== activeId)
    //       .map((item) => {
    //         if(item.id === overData.containerId){
    //           const nestedItems = [activeId, ...(item.views || [])]
    //           return {
    //             ...item,
    //             views: arrayMove(nestedItems, activeData.index, overData.index)
    //           }
    //         }
    //         return item
    //       })
    //   });
    // }
  }

  function handleDragStart(event: DragStartEvent) {
    const {active} = event;
    setActiveDrag(''+active.id); 
    if((''+active.id).includes('group')) {
      setOpenAccordions([...new Set([...openAccordions, (''+active.id)])])
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const {active, over} = event;
    console.log("🚀 ~ handleDragOver ~ active:", active)
    console.log('over: ', over)
    if(!over || !over.data.current || !active.data.current) return
    const overData = over.data.current.sortable as SortEventItemT
    const activeData = active.data.current.sortable as SortEventItemT
    // if(over.id.includes('group') && !openAccordions.includes(over.id)) {
    //   console.log('ta em cima do grupo: ', over.id)
    //   setOpenAccordions([...openAccordions, (over.id)])
    // } else if(overData.containerId.includes('group') && !openAccordions.includes(overData.containerId)) {
    //   setOpenAccordions([...openAccordions, (overData.containerId)])
    // } else {
    //   setOpenAccordions((OA) => { OA.pop(); return OA })
    // }

    if(overData.containerId.includes('group')) {
      setDbOrder((items) => {
        return items.filter(v => v.id !== active.id).map((item) => {
          if(item.id === overData.containerId){
            return {...item, views: [...new Set([''+active.id,...(item.views || [])])]}
          }
          return item
        })
      })
    }
    if(overData.containerId.includes('root') && !dbOrder.find((item) => item.id === active.id)) {
      const newItem: OrderItemT = {id: ''+active.id, type: 'view'}
      setDbOrder((items) => {
        return [newItem,...items.map((item) => {
          if(item.id === activeData.containerId && item.views){
            return {...item, views: item.views.filter((v) => v !== active.id)}
          }
          return item
        })]
      })
    }
  }

  const toggleAccordion = (id: string) => {
    console.log('toggleAccordion: ', id)
    if(openAccordions.includes(id)) {
      setOpenAccordions(openAccordions.filter((i) => i !== id))
    } else {
      setOpenAccordions([...new Set([...openAccordions, id])])
    }
  }
  return (
    <DndContext 
      sensors={sensors}
      // collisionDetection={closestCenter} default Rectangle intersection
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
    >
      <SortableContext
        id='root' 
        items={rootItemIds}
        strategy={verticalListSortingStrategy}
      >
        <SortableContainer id='root-context'>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#DDD',
            padding: '20px',
          }}>
            {
              dbOrder.map((item) => {
                if(item.type === 'group') {
                  const group = VIEW_GROUPS[item.id];
                  const nestedViewIds = item.views || []
                  const isExpanded = activeDrag !==item.id && openAccordions.includes(group.id)
                  return (
                    <SortableItem id={group.id} key={group.id} isGroup>
                      <Accordion 
                        onClick={() => toggleAccordion(group.id)} 
                        expanded={activeDrag !==item.id && openAccordions.includes(group.id)}
                        style={{...(activeDrag===item.id &&{ background: 'transparent' })}}
                      >
                        <AccordionSummary id={group.id}>
                          {group.title}
                        </AccordionSummary>
                        <AccordionDetails>
                          {isExpanded &&
                            <SortableContext
                              id={group.id}
                              items={nestedViewIds}
                              strategy={verticalListSortingStrategy}
                            >
                              <div 
                                style={{
                                  height: '100%',
                                  width: '100%',
                                }}
                              >

                              {nestedViewIds.map((viewId) => {
                                const view = VIEWS[viewId]
                                return (
                                  <SortableItem key={view.id} id={view.id}>{view.title}</SortableItem>
                                )
                              })}
                              </div>
                            </SortableContext>
                          }
                        </AccordionDetails>
                      </Accordion>
                    </SortableItem>
                  )
                } else {
                  const view = VIEWS[item.id]
                  return <SortableItem key={view.id} id={view.id}>{view.title}</SortableItem> 
                }
              })
            }
            <DragOverlay>
              {activeDrag && (
                <div 
                  style={{
                    width: '300px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    border: '1px solid black',
                    boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.2)',
                    marginBottom: '4px',
                    cursor: 'move',
                    color: 'black',
                  }}
                >
                  {VIEWS[activeDrag]?.title || VIEW_GROUPS[activeDrag]?.title}
                </div>
              )}
            </DragOverlay>
          </div>
          </SortableContainer>
      </SortableContext>
    </DndContext>
  ); 
}
