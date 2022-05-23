import React from 'react'

import FilterByStore from './FilterByStore'
import ProvinceSelector from './ProvinceSelector'

import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'filterContainer',
] as const

interface FilterProps {
  storesFilter: StoresFilter
  setStoresFilter: React.Dispatch<React.SetStateAction<StoresFilter>>
  storesSettings: StoreOnStoresFilter[]
}

const Filter = ({
  storesFilter,
  setStoresFilter,
  storesSettings,
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
        />
      </div>
    </>
  )
}

export default Filter
