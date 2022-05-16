const defaultStoresFilter: StoresFilter = {
  province: '',
  store: '',
}

export const filterStoresByProvince = (
  province: string,
  stores: SpecificationGroup[]
): SpecificationGroup[] => {
  if (!province) return stores

  return stores.filter((store) => store.address.state === province)
}

export const saveStoresFilter = (key: string, value: string) => {
  const filterLocalStorage = window.localStorage?.getItem('storesFilter')
  const storesFilter: StoresFilter = filterLocalStorage
    ? JSON.parse(filterLocalStorage)
    : defaultStoresFilter

  storesFilter[key] = value
  window.localStorage?.setItem('storesFilter', JSON.stringify(storesFilter))
}

export const getStoresFilter = (): StoresFilter => {
  const storesLocalStorage = window.localStorage?.getItem('storesFilter')

  const storesFilter = storesLocalStorage
    ? JSON.parse(storesLocalStorage)
    : defaultStoresFilter

  return storesFilter
}
