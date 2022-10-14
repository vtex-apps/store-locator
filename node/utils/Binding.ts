import type { TenantClient } from '@vtex/api'

export const TENANT_CACHE_TTL_S = 60 * 10
export const STORE_PRODUCT = 'vtex-storefront'

export const getStoreBindings = async (tenant: TenantClient) => {
  const { bindings } = await tenant.info({
    forceMaxAge: TENANT_CACHE_TTL_S,
  })

  const storeBindings = bindings.filter(
    (binding) => binding.targetProduct === STORE_PRODUCT
  )

  return storeBindings
}
