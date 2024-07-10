import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

export function SortableItem(props: {children?: React.ReactNode, id: string, isGroup?: boolean}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div
      ref={setNodeRef} 
      {...attributes} 
      {...listeners}
      style={{
        ...style,
        ...(!props.isGroup && {height: '60px'}),
      }}
      className='sortableItem'
    >
      {props.children}
    </div>
  );
}