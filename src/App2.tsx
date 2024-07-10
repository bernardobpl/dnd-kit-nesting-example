import {act, useMemo, useState} from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {SortableItem} from './SortableItem';
import './App.css';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

const ORDER1 = [
  'view-1', 
  'view-2', 
  'view-3', 
  'view-4', 
];
const ORDER2 = [
  'view-5', 
  'view-6', 
  'view-7', 
  'view-8', 
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

export default function App() {
  // const [dbOrder, setDbOrder] = useState([...ORDER1, ...ORDER2]);
  const [views1, setViews1] = useState(ORDER1);
  const [views2, setViews2] = useState(ORDER2);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    if(!over) return
    console.log('active: ', active)
    console.log('over: ', over)
    if(views1.includes(''+active.id) && views1.includes(''+over.id)){
      setViews1((items) => {
        const oldIndex = items.indexOf(''+active.id);
        const newIndex = items.indexOf(''+over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    if(views2.includes(''+active.id) && views2.includes(''+over.id)){
      setViews2((items) => {
        const oldIndex = items.indexOf(''+active.id);
        const newIndex = items.indexOf(''+over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;

    setActiveId(id);
  }

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DDD',
      }}
    >
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        
        <SortableContext 
          items={views1}
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
                views1.map((viewId) => <SortableItem key={VIEWS[viewId].id} id={VIEWS[viewId].id}>{VIEWS[viewId].title}</SortableItem>)
              }
            
        <SortableContext 
          items={views2}
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
                views2.map((viewId) => <SortableItem key={VIEWS[viewId].id} id={VIEWS[viewId].id}>{VIEWS[viewId].title}</SortableItem>)
              }
            </div>
        </SortableContext>
      </div>
      </SortableContext>
        <DragOverlay>
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
          {activeId}
          </div>
        </DragOverlay>
      </DndContext>
    </div>
  );
}