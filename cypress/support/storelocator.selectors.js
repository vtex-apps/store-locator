export default {
  AddPickUpButton: '.w-70-ns > :nth-child(2) > .vtex-button__label',
  PickUpPointName:
    '.w-60-ns > .vtex-input > .vtex-input-prefix__group > .vtex-styleguide-9-x-input',
  PickUpPointId:
    '.pl5-ns > .vtex-input > .vtex-input-prefix__group > .vtex-styleguide-9-x-input',
  PickUpAddress:
    '.w-70-m > .vtex-input > .vtex-input-prefix__group > .vtex-styleguide-9-x-input',
  CheckBox:
    ':nth-child(3) > .w-40-m > .vtex-checkbox__line-container > .vtex-checkbox__container > .vtex-checkbox__input',
  WorkStartTime:
    ':nth-child(3) > .flex-ns > :nth-child(1) > .vtex-input > .vtex-input-prefix__group > .vtex-styleguide-9-x-input',
  WorkEndTime:
    ':nth-child(3) > .flex-ns > :nth-child(3) > .vtex-input > .vtex-input-prefix__group > .vtex-styleguide-9-x-input',
  SaveChanges: '.flex.justify-end > .pb7 > .vtex-button > .vtex-button__label',
  ChangesSaved: 'div[class*=vtex-toast] .pr5',
  ListOfStores: '.overflow-auto > .list',
  LoadStores: '.vtex-store-locator-0-x-loadAll',
  MoreItems: '.vtex-store-locator-0-x-addressListLink',
  Hours: '.vtex-store-locator-0-x-hoursContainer',
  BackToPickUpPoint: '.vtex-store-locator-0-x-backlink',
  VtexButton: '.vtex-button',
  UploadInput: 'input[type=file]',
  CloseIcon: '.vtex-modal__close-icon',
  VtexAlert: '.vtex-alert .ph5',
  VtexStoreLocatorAddress: '.vtex-store-locator-0-x-addressStoreName',
  VtexStoreName: '.vtex-store-locator-0-x-addressStoreName',
  HoursContainer: '.vtex-store-locator-0-x-hoursContainer',
}

export function getAddressLink(index) {
  return `.vtex-store-locator-0-x-addressListItem:nth-child(${
    index + 1
  }) .vtex-store-locator-0-x-addressListLink`
}