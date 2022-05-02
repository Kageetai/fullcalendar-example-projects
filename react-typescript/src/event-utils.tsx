import { EventInput } from '@fullcalendar/react'
import moment from 'moment'

const EVENTS_COUNT = 1500
const TEACHERS_COUNT = 100
const COUNT_AVAIABILITY_PER_TEACHER = 10
let eventGuid = 0
const teacherScale = ['min', '10-15', '15-25']
type TeacherPerformance = 'min' | '10-15' | '15-25'

export const INITIAL_EVENTS: EventInput[] = []
export const INITIAL_TEACHERS: Array<{
  id: string
  title: string
  eventColor: string
  scale: TeacherPerformance
  availabilitiesCount: number
}> = []
export const INITIAL_TEACHER_AVAILABILITIES: EventInput[] = []

for (let i = 0; i < TEACHERS_COUNT; i++) {
  INITIAL_TEACHERS.push({
    id: 'teacherId' + i,
    title: 'Teacher ' + i,
    eventColor: '#' + ((Math.random() * 0xffffff) << 0).toString(16),
    scale: teacherScale[
      Math.floor(Math.random() * teacherScale.length)
    ] as TeacherPerformance,
    availabilitiesCount: 0,
  })

  for (let j = 0; j < COUNT_AVAIABILITY_PER_TEACHER; j++) {
    const start = moment()
      .day(i % 7)
      .hour(i % 24)
      .minute(0)

    const teacherId = Math.floor(Math.random() * INITIAL_TEACHERS.length)
    INITIAL_TEACHER_AVAILABILITIES.push({
      id: 'teacherId' + i + '_' + j,
      title: 'Availability Teacher ' + i + '_' + j,
      start: start.toISOString(),
      display: 'background',
      resourceId: INITIAL_TEACHERS[teacherId].id,
    })
    INITIAL_TEACHERS[teacherId].availabilitiesCount++
  }
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
