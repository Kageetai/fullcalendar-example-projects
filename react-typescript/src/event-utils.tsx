import { EventInput } from '@fullcalendar/react'

const EVENTS_COUNT = 1000
const TEACHERS_COUNT = 100
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = []
export const INITIAL_TEACHERS: Array<{
  id: string
  title: string
  eventColor: string
}> = []

for (let i = 0; i < TEACHERS_COUNT; i++) {
  INITIAL_TEACHERS.push({
    id: 'teacherId' + i,
    title: 'Teacher ' + i,
    eventColor: '#' + ((Math.random() * 0xffffff) << 0).toString(16),
  })
}

for (let i = 0; i < EVENTS_COUNT; i++) {
  INITIAL_EVENTS.push({
    id: createEventId(),
    title: 'Event ' + i,
    start: `${todayStr}T${String(i % 24).padStart(2, '0')}:00:00`,
    resourceId:
      INITIAL_TEACHERS[Math.floor(Math.random() * INITIAL_TEACHERS.length)].id,
  })
}

export function createEventId() {
  return String('eventId' + eventGuid++)
}
