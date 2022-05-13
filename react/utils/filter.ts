const defaultStoresFilter: StoresFilter = {
  province: '',
  brands: [],
}

export const filterStoresByProvince = (
  province: string,
  stores: SpecificationGroup[]
): SpecificationGroup[] => {
  if (!province) return stores

  return stores.filter((store) => store.address.state === province)
}

export const saveStoresFilter = (key: string, value: string | string[]) => {
  const filterLocalStorage = window.localStorage?.getItem('storesFilter')
  const storesFilter: StoresFilter = filterLocalStorage
    ? JSON.parse(filterLocalStorage)
    : defaultStoresFilter

  storesFilter[key] = value
  console.log(storesFilter)
  window.localStorage?.setItem('storesFilter', JSON.stringify(storesFilter))
}

export const getStoresFilter = (): StoresFilter => {
  const storesLocalStorage = window.localStorage?.getItem('storesFilter')

  console.log(storesLocalStorage)
  console.log(defaultStoresFilter)
  const storesFilter = storesLocalStorage
    ? JSON.parse(storesLocalStorage)
    : defaultStoresFilter

  return storesFilter
}
