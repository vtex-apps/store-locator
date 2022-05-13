import React from 'react'

import FilterByStore from './FilterByStore'
import ProvinceSelector from './ProvinceSelector'

interface FilterProps {
  storesFilter: StoresFilter
  setStoresFilter: React.Dispatch<React.SetStateAction<StoresFilter>>
}

const Filter = ({ storesFilter, setStoresFilter }: FilterProps) => {
  return (
    <>
      <div className="flex flex-row items-end justify-between">
        <ProvinceSelector
          storesFilter={storesFilter}
          setStoresFilter={setStoresFilter}
        />
        <FilterByStore />
      </div>
    </>
  )
}

export default Filter
