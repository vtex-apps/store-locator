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
  'hoursContainer',
  'hoursLabel',
  'hourRow',
  'dayOfWeek',
  'divider',
  'businessHours',
] as const

const timeFormat = (time: string, format?: string) => {
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
  intl,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group) {
    return null
  }

  return (
    <div className={handles.hoursContainer}>
      <span className={`b ${handles.hoursLabel}`}>
        {label ?? intl.formatMessage(messages.hoursLabel)}
      </span>
      <br />
      {group.businessHours.map((item: any, i: number) => {
        return (
          <div key={`hour_${i}`} className={handles.hourRow}>
            <span className={handles.dayOfWeek}>
              {intl.formatMessage(messages[item.dayOfWeek])}
            </span>
            <span className={handles.divider}>:</span>
            <span className={handles.businessHours}>
              {timeFormat(item.openingTime, format)}
              {` - `} {timeFormat(item.closingTime, format)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

interface StoreHoursProps {
  label?: string
  format?: string
}

StoreHours.propTypes = {
  label: PropTypes.string,
  format: PropTypes.oneOf(['24h', '12h']),
  intl: PropTypes.any,
}

export default injectIntl(StoreHours)
