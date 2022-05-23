/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const messages = defineMessages({
  hoursLabel: {
    defaultMessage: 'Store hours',
    id: 'store/hours-label',
  },
  storeClosed: {
    defaultMessage: 'Closed',
    id: 'store/store-closed',
  },
  '0': {
    defaultMessage: 'Monday',
    id: 'store/day-of-week-monday',
  },
  '1': {
    defaultMessage: 'Tuesday',
    id: 'store/day-of-week-tuesday',
  },
  '2': {
    defaultMessage: 'Wednesday',
    id: 'store/day-of-week-wednesday',
  },
  '3': {
    defaultMessage: 'Thursday',
    id: 'store/day-of-week-thursday',
  },
  '4': {
    defaultMessage: 'Friday',
    id: 'store/day-of-week-friday',
  },
  '5': {
    defaultMessage: 'Saturday',
    id: 'store/day-of-week-saturday',
  },
  '6': {
    defaultMessage: 'Sunday',
    id: 'store/day-of-week-sunday',
  },
})

const CSS_HANDLES = [
  'hoursContainer',
  'hoursLabel',
  'hourRow',
  'dayOfWeek',
  'divider',
  'businessHours',
] as const

const timeFormat = (time: string, format?: string) => {
  if (!time) {
    return ''
  }

  const [hour, minute] = time.split(':')

  if (format?.toLocaleLowerCase() === '12h') {
    return `${
      parseInt(hour, 10) > 12 ? parseInt(hour, 10) - 12 : hour
    }:${minute}${parseInt(hour, 10) >= 12 ? 'pm' : 'am'}`
  }

  return `${hour}:${minute}`
}

const StoreHours: FC<WrappedComponentProps & StoreHoursProps> = ({
  label,
  format,
  businessHours,
  intl,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group) {
    return null
  }

  const displayHours = (item) => {
    const open = timeFormat(item.openingTime, format)
    const close = timeFormat(item.closingTime, format)

    if (!open && !close) {
      return intl.formatMessage(messages.storeClosed)
    }

    return `${open} - ${close}`
  }

  return (
    <div className={handles.hoursContainer}>
      <span className={`b ${handles.hoursLabel}`}>
        {label ?? intl.formatMessage(messages.hoursLabel)}
      </span>
      {businessHours?.map((item: any, i: number) => {
        return (
          <div
            key={`hour_${i}`}
            className={`${handles.hourRow} mv1 flex flex-wrap space-between`}
          >
            <div className={`${handles.dayOfWeek} w-50`}>
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
              className={`${handles.hourRow} mv1 flex flex-wrap space-between`}
            >
              <div className={`${handles.dayOfWeek} w-50`}>
                {intl.formatMessage(messages[item.dayOfWeek])}
                <span className={handles.divider}>:</span>
              </div>
              <div className={`${handles.businessHours} tc w-50`}>
                {displayHours(item)}
              </div>
            </div>
          )
        })}
    </div>
  )
}

interface StoreHoursProps {
  label?: string
  format?: string
  businessHours?: any
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
  intl: PropTypes.any,
}

export default injectIntl(StoreHours)
