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
import { ORDER, OrderItemT, SortEventItemT, VIEWS, VIEW_GROUPS } from './constsAndTypes';
import { SortableGroup } from './SortableGroup';

export default function App() {
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [activeDrag, setActiveDrag] = useState<string | null>(null);
  const [dbOrder, setDbOrder] = useState(ORDER);
  const rootItemIds = dbOrder.map((item) => item.id)
  const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 10}}), useSensor(MouseSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    if(!over || !over.data.current || !active.data.current) return

    setActiveDrag(null)

    const activeData = active.data.current.sortable as SortEventItemT
    const activeId = ''+active.id
    const isActiveGroup = activeId.includes('group')

    const overData = over.data.current.sortable as SortEventItemT
    const isOverFromRoot = overData.containerId === 'root'
    const isOverFromGroup = !isOverFromRoot

    const isNotMoving = active.id === over.id
    const isMovingGroupIntoGroup = isActiveGroup && isOverFromGroup
    if(isNotMoving || isMovingGroupIntoGroup) return

    const isMovingItemInSameContainer = activeData.containerId === overData.containerId
    if(isMovingItemInSameContainer) {
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
  }

  function handleDragStart(event: DragStartEvent) {
    const {active} = event;
    setActiveDrag(''+active.id); 
    if((''+active.id).includes('group') && !openAccordions.includes(''+active.id)) {
      setOpenAccordions([...openAccordions, (''+active.id)])
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const {active, over} = event;
    if(!over || !over.data.current || !active.data.current) return

    const overData = over.data.current.sortable as SortEventItemT
    const activeData = active.data.current.sortable as SortEventItemT

    if(overData.containerId.includes('group') && !active.id.toString().includes('group')) {
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
    if(openAccordions.includes(id)) {
      setOpenAccordions(openAccordions.filter((i) => i !== id))
    } else {
      setOpenAccordions([...new Set([...openAccordions, id])])
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
    >
      <SortableContext
        id='root' 
        items={rootItemIds}
        strategy={verticalListSortingStrategy}
      >
          <div className='rootItemsWrapper'>
            {
              dbOrder.map((item) => {
                if(item.type === 'group') {
                  const group = VIEW_GROUPS[item.id];
                  const nestedViewIds = item.views || []
                  const isExpanded = activeDrag !==item.id && openAccordions.includes(group.id)
                  return (
                    <SortableGroup
                      group={group} 
                      nestedViewIds={nestedViewIds} 
                      activeDrag={activeDrag} 
                      isExpanded={isExpanded} 
                      toggleAccordion={toggleAccordion}
                    />
                  )
                } else {
                  const view = VIEWS[item.id]
                  return <SortableItem key={view.id} id={view.id}>{view.title}</SortableItem> 
                }
              })
            }
            <DragOverlay>
              {activeDrag && (
                <div className='dragOverlay'>
                  {VIEWS[activeDrag]?.title || VIEW_GROUPS[activeDrag]?.title}
                </div>
              )}
            </DragOverlay>
          </div>
      </SortableContext>
    </DndContext>
  ); 
}
