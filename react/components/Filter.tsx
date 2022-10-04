import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import FilterByStore from './FilterByStore'
import ProvinceSelector from './ProvinceSelector'

const CSS_HANDLES = ['filterContainer'] as const

interface FilterProps {
  storesFilter: StoresFilter
  setStoresFilter: React.Dispatch<React.SetStateAction<StoresFilter>>
  activeDrawer: boolean
  setActiveDrawer: React.Dispatch<React.SetStateAction<boolean>>
  storesSettings: StoreOnStoresFilter[]
}

const Filter = ({
  storesFilter,
  setStoresFilter,
  storesSettings,
  activeDrawer,
  setActiveDrawer
}: FilterProps) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <>
      <div className={handles.filterContainer}>
        <ProvinceSelector
          storesFilter={storesFilter}
          setStoresFilter={setStoresFilter}
        />
        <FilterByStore
          storesSettings={storesSettings}
          storesFilter={storesFilter}
          setStoresFilter={setStoresFilter}
          activeDrawer={activeDrawer}
          setActiveDrawer={setActiveDrawer}
        />
      </div>
    </>
  )
}

export default Filter
