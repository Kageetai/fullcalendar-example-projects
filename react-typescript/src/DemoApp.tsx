import React, { useState } from 'react'
import FullCalendar, {
  EventApi,
  EventClickArg,
  EventContentArg,
  formatDate,
} from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import {
  createEventId,
  INITIAL_EVENTS,
  INITIAL_TEACHER_AVAILABILITIES,
  INITIAL_TEACHERS,
} from './event-utils'
import listPlugin from '@fullcalendar/list'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid'
import scrollGridPlugin from '@fullcalendar/scrollgrid'
import momentPlugin from '@fullcalendar/moment'

const Demo = () => {
  const [slotEventOverlap, setSlotEventOverlap] = useState(false)
  const [datesAboveResources, setDatesAboveResources] = useState(false)
  const [groupByScale, setGroupByScale] = useState(false)
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([])

  const handleDateClick = (selectInfo: DateClickArg) => {
    const title = prompt('Please enter a new title for your event')
    const calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.dateStr,
        allDay: selectInfo.allDay,
        resourceId: selectInfo.resource?.id,
      })
    }
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove()
    }
  }

  const SidebarEvent = (event: EventApi) => (
    <li key={event.id}>
      <b>
        {formatDate(event.start!, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </b>
      <i>{event.title}</i>{' '}
      {event.getResources().map((resource) => resource.title)}
    </li>
  )

  const Sidebar = () => (
    <div className='demo-app-sidebar'>
      <div className='demo-app-sidebar-section'>
        <h2>Instructions</h2>

        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div>

      <div className='demo-app-sidebar-section'>
        <h2>Options</h2>

        <ul>
          <li>
            <label>
              <input
                type='checkbox'
                checked={slotEventOverlap}
                onChange={() => setSlotEventOverlap((s) => !s)}
              ></input>
              toggle overlap
            </label>
          </li>

          <li>
            <label>
              <input
                type='checkbox'
                checked={datesAboveResources}
                onChange={() => setDatesAboveResources((s) => !s)}
              ></input>
              dates above teachers
            </label>
          </li>

          <li>
            <label>
              <input
                type='checkbox'
                checked={groupByScale}
                onChange={() => setGroupByScale((s) => !s)}
              ></input>
              group by scale
            </label>
          </li>
        </ul>
      </div>

      <div className='demo-app-sidebar-section'>
        <h2>All Events ({currentEvents.length})</h2>

        <ul>{currentEvents.map(SidebarEvent)}</ul>
      </div>
    </div>
  )

  return (
    <div className='demo-app'>
      <Sidebar />

      <div className='demo-app-main'>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
            resourceTimelinePlugin,
            resourceTimeGridPlugin,
            resourceDayGridPlugin,
            scrollGridPlugin,
            momentPlugin,
          ]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right:
              'resourceDayGridDay,resourceDayGridWeek,resourceDayGridMonth resourceTimeGridDay,resourceTimeGridWeek resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth timeGridDay,timeGridWeek dayGridWeek,dayGridMonth listDay,listWeek',
          }}
          initialView='resourceTimelineWeek'
          height='auto'
          resourceAreaWidth='20%'
          resourceGroupField={groupByScale ? 'scale' : undefined}
          dayMinWidth={100}
          editable={true}
          selectable={false}
          selectMirror={false}
          dayMaxEvents={true}
          allDaySlot={false}
          slotEventOverlap={slotEventOverlap}
          datesAboveResources={datesAboveResources}
          slotDuration={'01:00:00'}
          eventSources={[INITIAL_EVENTS, INITIAL_TEACHER_AVAILABILITIES]}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventsSet={setCurrentEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
          */
          resourceAreaHeaderContent={'Teachers'}
          resources={INITIAL_TEACHERS}
          resourceAreaColumns={[
            {
              field: 'title',
              headerContent: 'Name',
            },
            {
              field: 'availabilitiesCount',
              headerContent: 'Total Availabilities',
            },
            {
              field: 'scale',
              headerContent: 'Modifier',
            },
          ]}
        />
      </div>
    </div>
  )
}

export default Demo
