import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import { SortableItem } from "./SortableItem"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { VIEWS, ViewGroupT } from "./constsAndTypes"

type SortableGroupProps = {
  group: ViewGroupT
  nestedViewIds: string[]
  activeDrag: string | null
  isExpanded: boolean
  toggleAccordion: (groupId: string) => void
}
export const SortableGroup = ({group, nestedViewIds, activeDrag, isExpanded, toggleAccordion}: SortableGroupProps) => {
  return (
    <SortableItem id={group.id} key={group.id} isGroup>
      <Accordion 
        onClick={() => toggleAccordion(group.id)} 
        expanded={isExpanded}
        style={{...(activeDrag===group.id &&{ background: 'transparent' })}}
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
}