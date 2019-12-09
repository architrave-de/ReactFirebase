let oneDay = 1000 * 60 * 60 * 24
const date = new Date()

/**
 * @param {year} [number=2019] {default current year}.
 * @param {month} [number=12] {default current month} day number to month}.
 * @param {firstDay} [number=3] {default first day of the given month} day number to month.
 * @param {lastDay} [number=23] {default last day of the given month} day number to month.
 */

export function getMonthFirstLastDay({ monthDate = date }) {
  const thisMonth = monthDate.getMonth()
  const firstDayOfTheMonth = new Date(monthDate.getFullYear(), thisMonth, 1)
  const lastDayOfTheMonth = new Date(monthDate.getFullYear(), thisMonth + 1, 0)
  return {
    firstDayOfTheMonth,
    lastDayOfTheMonth
  }
}

/**
 * @param {year} [number=2019]
 * @param {startDate} [date=today]
 */
export function dayToYear({ startDate = date }) {
  console.log('TCL: dayToYear -> date', date)
  const yearStartDay = new Date(date.getFullYear(), 0, 0)
  const diff =
    startDate -
    yearStartDay +
    (date.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000
  const dayNumber = Math.floor(diff / oneDay)
  const dateYear = startDate.getFullYear()
  const dateMonth = ('0' + (startDate.getMonth() + 1)).slice(-2)
  const yearPrefix = dateYear.toString().slice(-2)
  const yearDayNumber = parseInt(yearPrefix.concat(dayNumber.toString()))
  return {
    year: dateYear,
    month: dateMonth,
    dayNumber: dayNumber,
    yearDayNumber: yearDayNumber
  }
}

/**
 * @param {day} object
 * @returns day number to year like 19313 to be used to get the matched day rounds
 */
export function dayWithYearNumber({ day }) {
  const yearPrefix = day.year.toString().slice(-2)
  const dayNumber = day.dayNumber.toString()
  return parseInt(yearPrefix.concat(dayNumber))
}

export function startEndDates(startDate, endDate) {
  return {
    startDateNumber: dayWithYearNumber({ day: startDate }),
    endDateNumber: dayWithYearNumber({ day: endDate })
  }
}

export function monthName(monthNumber) {
  const names = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  return names[monthNumber]
}
