/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from 'react'
import React from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const messages = defineMessages({
  hoursLabel: {
    defaultMessage: 'Store hours',
    id: 'store/hours-label',
  },
  groceryHoursLabel: {
    defaultMessage: 'Grocery opening times',
    id: 'store/grocery-hours-label',
  },
  holidayLabel: {
    defaultMessage: 'Holidays',
    id: 'store/holidays-label',
  },
  storeClosed: {
    defaultMessage: 'Closed',
    id: 'store/store-closed',
  },
  '0': {
    defaultMessage: 'Sunday',
    id: 'store/day-of-week-sunday',
  },
  '1': {
    defaultMessage: 'Monday',
    id: 'store/day-of-week-monday',
  },
  '2': {
    defaultMessage: 'Tuesday',
    id: 'store/day-of-week-tuesday',
  },
  '3': {
    defaultMessage: 'Wednesday',
    id: 'store/day-of-week-wednesday',
  },
  '4': {
    defaultMessage: 'Thursday',
    id: 'store/day-of-week-thursday',
  },
  '5': {
    defaultMessage: 'Friday',
    id: 'store/day-of-week-friday',
  },
  '6': {
    defaultMessage: 'Saturday',
    id: 'store/day-of-week-saturday',
  },
})

const CSS_HANDLES = [
  'hoursMainContainer',
  'hoursContainer',
  'hoursLabel',
  'groceryHoursLabel',
  'hourRow',
  'dayOfWeek',
  'divider',
  'businessHours',
  'hourHolidayRow',
  'pickupHolidaysContainer'
] as const

const timeFormat = (time: string, format?: string) => {
  if (!time) {
    return ''
  }

  const [hour, minute] = time.split(':')

  if (format?.toLocaleLowerCase() === '12h') {
    return `${parseInt(hour, 10) > 12 ? parseInt(hour, 10) - 12 : hour
      }:${minute}${parseInt(hour, 10) >= 12 ? 'pm' : 'am'}`
  }

  return `${hour}:${minute}`
}

const StoreHours: FC<WrappedComponentProps & StoreHoursProps> = ({
  label,
  format,
  businessHours,
  pickupHolidays,
  intl,
}) => {
  function isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group) {
    return null
  }
  const validJSON = isValidJSON(group.instructions)
  const instructionsParsed = validJSON ? JSON.parse(group.instructions) : null
  const groceryBusinessHours = instructionsParsed ? instructionsParsed.groceryBusinessHours : null
  const groceryTitle = instructionsParsed ? instructionsParsed.groceryTitle : null

  const displayHours = (item) => {
    const open = timeFormat(item.openingTime, format)
    const close = timeFormat(item.closingTime, format)

    if (!open && !close) {
      return intl.formatMessage(messages.storeClosed)
    }

    return `${open} - ${close}`
  }

  const displayHolidayDay = (item) => {
    const holiday = new Date(item.date)
    const { locale } = intl
    const month = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(holiday)

    const today = new Date()

    if (today >= holiday) {
      return ``
    }

    return (
      <div className={`${handles.dayOfWeek} w-30`}>
        Bank Holiday {month}
      </div>
    )
  }

  const displayHolidayHours = (item) => {
    const open = timeFormat(item.hourBegin, format)
    const close = timeFormat(item.hourEnd, format)
    const holiday = new Date(item.date)

    const today = new Date()

    if (open === '' && close === '') {
      return (
        <div className={`${handles.businessHours} tc w-50`}>
          {intl.formatMessage(messages.storeClosed)}
        </div>
      )
    }

    if (today >= holiday) {
      return ``
    }

    return (
      <div className={`${handles.businessHours} tc w-50`}>
        {open} - {close}
      </div>
    )
  }

  return (
    <>
      <div className={`${handles.pickupHolidaysContainer} container mt6`}>
        {!pickupHolidays &&
          group.pickupHolidays.map((item: any, i: number) => (
            <div
              key={`hour_${i}`}
              className={`${handles.hourHolidayRow} mv1 ph2 flex flex-wrap`}
            >
              {displayHolidayDay(item)}
              {displayHolidayHours(item)}
            </div>
          ))}
      </div>
      <div
        className={`${handles.hoursMainContainer} container flex justify-around flex-wrap flex-nowrap-l`}
      >
        <div className={`${handles.hoursContainer} w-100 ${groceryBusinessHours ? 'w-50-l' : 'w-100-l'} mh3 box`}>
          <span className={`b ${handles.hoursLabel}`}>
            {label ?? intl.formatMessage(messages.hoursLabel)}
          </span>
          <br />
          {businessHours?.map((item: any, i: number) => {
            return (
              <div
                key={`hour_${i}`}
                className={`${handles.hourRow} mv1 ph2 flex flex-wrap`}
              >
                <div className={`${handles.dayOfWeek} w-30`}>
                  {item.dayOfWeek}
                  <span className={handles.divider}>:</span>
                </div>
                <div className={`${handles.businessHours} tc w-50`}>
                  {item.openingTime} - {item.closingTime}
                </div>
              </div>
            )
          })}
          {!businessHours &&
            group.businessHours.map((item: any, i: number) => {
              return (
                <div
                  key={`hour_${i}`}
                  className={`${handles.hourRow} mv1 ph2 flex flex-wrap`}
                >
                  <div className={`${handles.dayOfWeek} w-30`}>
                    {intl.formatMessage(messages[item.dayOfWeek])}
                    <span className={handles.divider}>:</span>
                  </div>
                  <div className={`${handles.businessHours} tc w-50`}>
                    {displayHours(item)}
                  </div>
                </div>
              )
            })}
          <br />
          <b>{intl.formatMessage(messages.holidayLabel)}</b>
        </div>
        {groceryBusinessHours &&
          (<div className={`${handles.hoursContainer} w-100 w-50-l mh3 box`}>
            <span className={`b ${handles.groceryHoursLabel}`}>
              {groceryTitle ? groceryTitle : intl.formatMessage(messages.groceryHoursLabel)}
            </span>
            <br />
            {groceryBusinessHours.map((item: any, i: number) => {
              return (
                <div
                  key={`hour_${i}`}
                  className={`${handles.hourRow} mv1 ph2 flex flex-wrap`}
                >
                  <div className={`${handles.dayOfWeek} w-30`}>
                    {intl.formatMessage(messages[item.dayOfWeek])}
                    <span className={handles.divider}>:</span>
                  </div>
                  <div className={`${handles.businessHours} tc w-50`}>
                    {displayHours(item)}
                  </div>
                </div>
              )
            })}
            <br />
          </div>)}
      </div>
    </>
  )
}

interface StoreHoursProps {
  label?: string
  format?: string
  businessHours?: any
  pickupHolidays?: any
}

StoreHours.propTypes = {
  label: PropTypes.string,
  format: PropTypes.oneOf(['24h', '12h']),
  businessHours: PropTypes.arrayOf(
    PropTypes.shape({
      dayOfWeek: PropTypes.string,
      openingTime: PropTypes.string,
      closingTime: PropTypes.string,
    })
  ),
  pickupHolidays: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      hourBegin: PropTypes.string,
      hourEnd: PropTypes.string,
    })
  ),
  intl: PropTypes.any,
}

export default injectIntl(StoreHours)
