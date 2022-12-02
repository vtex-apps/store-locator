export default {
  AddPickUpButton: '.vtex-button .vtex-button__label div',
  SaveChanges: '.vtex-button > .vtex-button__label',
  ChangesSaved: 'div[class*=vtex-toast] .pr5',
  ListOfStores: '.overflow-auto > .list',
  LoadStores: 'span[class*=loadAll]',
  MoreItems: 'span[class*=addressListLink]',
  AddressContainer: 'div[class*=addressContainer]',
  BackToPickUpPoint: 'span[class*=backlink]',
  VtexButton: '.vtex-button',
  UploadInput: 'input[type=file]',
  CloseIcon: '.vtex-modal__close-icon',
  VtexAlert: '.vtex-alert .ph5',
  VtexStoreName: 'span[class*=addressStoreName]',
  HoursContainer: 'div[class*=hoursContainer]',
  SaveButton: '.flex.justify-end > .pb7 > .vtex-button > .vtex-button__label',
  StorePickUpPointList: '.overflow-auto > .list',
  PickupInStoresAddressLink: '.srp-address-title',
  PickupInStoresShowList: '#pkpmodal-show-list-btn',
  ShippingPolicyPickUpPointToggle: '#active',
  ShippingPolicySaveChanges:
    '.styleguide__floating-action-bar > :nth-child(2) > .vtex-button',
  PickUpModelSearch: 'form[class*=modalSearch] input',
  FindPickupLink: '#find-pickup-link',
  ShippingPolicyStatusToggle: '#isActive',
  ShippingPolicyActiveStatus:
    'label[for="isActive"] > div > div[class*=primary]',
  ShippingPolicyPickupPointStatus:
    'label[for="active"] > div > div[class*=primary]',
  FillInvoiceAddress: 'p[class*=omnishipping] ~ button[class*=omnishipping]',
}

export function getAddressLink(index) {
  return `span[class*=addressListItem]:nth-child(${
    index + 1
  }) span[class*=addressListLink]`
}

export function getPickupPoint(pickupPoint) {
  return `.pickupPoint-1_${pickupPoint}`
}
