import { EventInput } from '@fullcalendar/react'
import moment from 'moment'

const EVENTS_COUNT = 1500
const TEACHERS_COUNT = 100
let eventGuid = 0
const teacherScale = ['min', '10-15', '15-25']
type TeacherPerformance = 'min' | '10-15' | '15-25'

export const INITIAL_EVENTS: EventInput[] = []
export const INITIAL_TEACHERS: Array<{
  id: string
  title: string
  eventColor: string
  scale: TeacherPerformance
}> = []

for (let i = 0; i < TEACHERS_COUNT; i++) {
  INITIAL_TEACHERS.push({
    id: 'teacherId' + i,
    title: 'Teacher ' + i,
    eventColor: '#' + ((Math.random() * 0xffffff) << 0).toString(16),
    scale: teacherScale[
      Math.floor(Math.random() * teacherScale.length)
    ] as TeacherPerformance,
  })
}

for (let i = 0; i < EVENTS_COUNT; i++) {
  const start = moment()
    .day(i % 7)
    .hour(i % 24)
    .minute(0)

  INITIAL_EVENTS.push({
    id: createEventId(),
    title: 'Event ' + i,
    start: start.toISOString(),
    resourceId:
      INITIAL_TEACHERS[Math.floor(Math.random() * INITIAL_TEACHERS.length)].id,
  })
}

export function createEventId() {
  return String('eventId' + eventGuid++)
}
