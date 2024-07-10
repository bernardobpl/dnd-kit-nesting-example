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
      // onClick={() => {
      //   console.log('eoq')
      // }}
      
      style={{
        ...style,
        width: '300px',
        ...(!props.isGroup && {height: '60px'}),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        border: '1px solid black',
        boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.2)',
        marginBottom: '4px',
        cursor: 'move',
        color: 'black',
        // ...(props.isGroup && {
        //   width: '10px',
        //   height: '40px',
        // })
      }}
    >
      {props.children}
    </div>
  );
}