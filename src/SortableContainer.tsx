import {useSortable} from '@dnd-kit/sortable';

export function SortableContainer(props: {children?: React.ReactNode, id: string, isGroup?: boolean}) {
  const {
    attributes,
    listeners,
    setNodeRef,
  } = useSortable({id: props.id});
  
  return (
    <div
      id='root-context'
      ref={setNodeRef} 
      {...attributes} 
      {...listeners}
    >
      {props.children}
    </div>
  );
}