import React from 'react'
import FullCalendar, {
  EventApi,
  EventClickArg,
  EventContentArg,
  formatDate,
} from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { createEventId, INITIAL_EVENTS, INITIAL_TEACHERS } from './event-utils'
import listPlugin from '@fullcalendar/list'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid'
import scrollGridPlugin from '@fullcalendar/scrollgrid'
import momentPlugin, { toMoment } from '@fullcalendar/moment'

interface DemoAppState {
  slotEventOverlap: boolean
  datesAboveResources: boolean
  currentEvents: EventApi[]
}

export default class DemoApp extends React.Component<{}, DemoAppState> {
  state: DemoAppState = {
    slotEventOverlap: false,
    datesAboveResources: false,
    currentEvents: [],
  }

  render() {
    return (
      <div className='demo-app'>
        {this.renderSidebar()}
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
            resourceGroupField='scale'
            dayMinWidth={100}
            editable={true}
            selectable={false}
            selectMirror={false}
            dayMaxEvents={true}
            allDaySlot={false}
            slotEventOverlap={this.state.slotEventOverlap}
            datesAboveResources={this.state.datesAboveResources}
            slotDuration={'01:00:00'}
            initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            dateClick={this.handleDateClick}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
            resourceAreaHeaderContent={'Teachers'}
            resources={INITIAL_TEACHERS}
          />
        </div>
      </div>
    )
  }

  renderSidebar() {
    return (
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
          <label>
            <input
              type='checkbox'
              checked={this.state.slotEventOverlap}
              onChange={this.handleOverlapToggle}
            ></input>
            toggle overlap
          </label>
        </div>
        <div className='demo-app-sidebar-section'>
          <label>
            <input
              type='checkbox'
              checked={this.state.datesAboveResources}
              onChange={this.handleDatesAboveResourcesToggle}
            ></input>
            dates above teachers
          </label>
        </div>
        <div className='demo-app-sidebar-section'>
          <h2>All Events ({this.state.currentEvents.length})</h2>
          <ul>{this.state.currentEvents.map(renderSidebarEvent)}</ul>
        </div>
      </div>
    )
  }

  handleOverlapToggle = () => {
    this.setState({
      slotEventOverlap: !this.state.slotEventOverlap,
    })
  }

  handleDatesAboveResourcesToggle = () => {
    this.setState({
      datesAboveResources: !this.state.datesAboveResources,
    })
  }

  handleDateClick = (selectInfo: DateClickArg) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

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

  handleEventClick = (clickInfo: EventClickArg) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove()
    }
  }

  handleEvents = (events: EventApi[]) => {
    this.setState({
      currentEvents: events,
    })
  }
}

function renderEventContent(eventContent: EventContentArg) {
  return (
    <>
      <b>{eventContent.timeText}</b>
      <i>{eventContent.event.title}</i>
    </>
  )
}

function renderSidebarEvent(event: EventApi) {
  return (
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
}
