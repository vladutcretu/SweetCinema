// React, depedencies & packages
import { format, parseISO } from "date-fns"
import { enUS } from "date-fns/locale"

// Components here


const ShowtimesByDay = (showtimes) => {
  const grouped_showtimes = {}
  showtimes.forEach((showtime) => {
    const date = parseISO(showtime.starts_at)
    const day = format(date, "EEEE", {locale: enUS})

    if (!grouped_showtimes[day]) grouped_showtimes[day] = []
    grouped_showtimes[day].push(showtime)
  })

  return grouped_showtimes
}
export default ShowtimesByDay