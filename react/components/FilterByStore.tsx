import React from 'react'
import { Button } from 'vtex.styleguide'
import { saveStoresFilter } from '../utils'


interface FilterByStoreProps {
  storesFilter: StoresFilter
  setStoresFilter: React.Dispatch<React.SetStateAction<StoresFilter>>
  storesSettings: StoreOnStoresFilter[]
}

const FilterByStore = ({ storesFilter, setStoresFilter, storesSettings }: FilterByStoreProps) => {
  const handleSelectStore = (e) => {
    const { value } = e.target
    setStoresFilter((prev) => ({ ...prev, store: value  }))
    saveStoresFilter("store", value)
}
  return (
    <>
      <Button variation="tertiary">FilterByStore</Button>
      <ul>
        {storesSettings.map((s) => (
          <li key={s.name}>
            <input type='radio' name='store' value={s.name} id={s.name}
              onChange={handleSelectStore} checked={s.name === storesFilter.store} />
            <label htmlFor={s.name}>
              <img width="40px" height="40px" src={s.inactiveImageUrl} />
            </label>
          </li>
        ))}
        </ul>
    </>
  )
}

export default FilterByStore
