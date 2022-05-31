import React, { useState } from 'react'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { defineMessages, useIntl } from 'react-intl'

import { saveStoresFilter } from '../utils'
import Drawer from './Drawer'

const CSS_HANDLES = [
  'secondaryButton',
  'filterStoresButton',
  'filterStoreList',
  'filterStoreListItem',
  'filterStoreListItemActive',
  'filterStoreListItemCheck',
  'filterStoreListItemLabel',
  'filterStoreListItemImg',
] as const

interface FilterByStoreProps {
  storesFilter: StoresFilter
  setStoresFilter: React.Dispatch<React.SetStateAction<StoresFilter>>
  storesSettings: StoreOnStoresFilter[]
}

const FilterByStore = ({
  storesFilter,
  setStoresFilter,
  storesSettings,
}: FilterByStoreProps) => {
  const handleSelectStore = (e) => {
    const { value } = e.target

    setStoresFilter((prev) => ({ ...prev, store: value }))
    saveStoresFilter('store', value)
  }

  const resetFilter = () => {
    setStoresFilter((prev) => ({ ...prev, store: '' }))
    saveStoresFilter('store', '')
  }

  const [activeDrawer, setActiveDrawer] = useState<boolean>(false)
  const handles = useCssHandles(CSS_HANDLES)
  const intl = useIntl()
  const messages = defineMessages({
    filterByStore: {
      defaultMessage: 'Filter by store',
      id: 'store/filter-by-store',
    },
    reset: {
      defaultMessage: 'Reset',
      id: 'store/reset-filter',
    },
  })

  return (
    <>
      <div
        className={`${handles.secondaryButton} ${handles.filterStoresButton}`}
      >
        <Button onClick={() => setActiveDrawer((prevValue) => !prevValue)}>
          {intl.formatMessage(messages.filterByStore)}
        </Button>
      </div>
      <Drawer
        active={activeDrawer}
        title={intl.formatMessage(messages.filterByStore)}
        headerOption={
          <Button onClick={() => resetFilter()} disabled={!storesFilter.store}>
            {intl.formatMessage(messages.reset)}
          </Button>
        }
        onClose={<Button onClick={() => setActiveDrawer(false)} />}
      >
        <ul className={handles.filterStoreList}>
          {storesSettings.map((s) => (
            <li
              key={s.name}
              className={`${handles.filterStoreListItem} ${
                storesFilter.store === s.name &&
                handles.filterStoreListItemActive
              }`}
            >
              <input
                type="radio"
                name="store"
                value={s.name}
                id={s.name}
                onChange={handleSelectStore}
                checked={s.name === storesFilter.store}
                className={handles.filterStoreListItemCheck}
              />
              <label
                htmlFor={s.name}
                className={handles.filterStoreListItemLabel}
              >
                <img
                  src={s.img}
                  alt={s.name}
                  className={handles.filterStoreListItemImg}
                />
              </label>
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  )
}

export default FilterByStore
