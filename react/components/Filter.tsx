import React from 'react'

import FilterByStore from './FilterByStore'
import ProvinceSelector from './ProvinceSelector'

interface FilterProps {
  storesFilter: StoresFilter
  setStoresFilter: React.Dispatch<React.SetStateAction<StoresFilter>>
  storesSettings: StoreOnStoresFilter[]
}

const Filter = ({ storesFilter, setStoresFilter, storesSettings }: FilterProps) => {
  return (
    <>
      <div className="flex flex-row items-end justify-between">
        <ProvinceSelector
          storesFilter={storesFilter}
          setStoresFilter={setStoresFilter}
        />
        <FilterByStore storesSettings={storesSettings} setStoresFilter={setStoresFilter} />
      </div>
    </>
  )
}

export default Filter
