import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'

import { saveStoresFilter } from '../utils'

const ZAF = [
  { value: '', label: 'View all stores' },
  { value: 'Eastern Cape', label: 'Eastern Cape' },
  { value: 'Free State', label: 'Free State' },
  { value: 'Gauteng', label: 'Gauteng' },
  { value: 'KwaZulu-Natal', label: 'KwaZulu-Natal' },
  { value: 'Limpopo', label: 'Limpopo' },
  { value: 'Mpumalanga', label: 'Mpumalanga' },
  { value: 'North West', label: 'North West' },
  { value: 'Northern Cape', label: 'Northern Cape' },
  { value: 'Western Cape', label: 'Western Cape' },
]

interface ProvinceSelectorProps {
  storesFilter: StoresFilter
  setStoresFilter: React.Dispatch<React.SetStateAction<StoresFilter>>
}

const ProvinceSelector = ({
  storesFilter,
  setStoresFilter,
}: ProvinceSelectorProps) => {
  const handleChange = (_, value: string) => {
    setStoresFilter((prevState) => ({ ...prevState, province: value }))
    saveStoresFilter('province', value)
  }

  return (
    <Dropdown
      label={<FormattedMessage id="store/filter-by-province" />}
      options={ZAF}
      value={storesFilter.province}
      onChange={handleChange}
    />
  )
}

export default ProvinceSelector
