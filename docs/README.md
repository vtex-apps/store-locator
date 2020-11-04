📢 Use this project, [contribute](https://github.com/{OrganizationName}/{AppName}) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Store Locator

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

Uses the **Pickup points** information to add the Store Locator functionality to the Store.

![List](./images/store-list.png)
![Detail](./images/store-detail.png)

## Configuration

1. [Install](https://vtex.io/docs/recipes/development/installing-an-app/) the Store Locator app by running `vtex install vtex.store-locator`.
2. Open your store's Store Theme app directory in your code editor.
3. Add the Store Locator app as a `peerDependency` in the `manifest.json` file:

```diff
 "peerDependencies": {
+  "vtex.store-locator": "0.x"
 }
```

Now, your store already have a `/stores` route that will list the stores that are registered under **Admin > Orders > Inventory & shipping > Pickup points**, this app install a full solution, but you can customize according to your needs.

This app exports a few interfaces that you can use on your theme, `store-list` that contains a list of stores and a map with all the markers,
You also have `store-group` which provides a context to other small interfaces, `store-back-link`, `store-map`, `store-address`, `store-hours`, `store-instructions` and `store-name`

A few interfaces may have properties available for extra customization.

### `store-group` props

| Prop name       | Type     | Description                                                | Default value |
| --------------- | -------- | ---------------------------------------------------------- | ------------- |
| `title`         | `string` | Store page title                                           | `{storeName}` |
| `imageSelector` | `string` | CSS Selector that will reach all the desired images        | ``            |
| `phoneSelector` | `string` | CSS Selector that will reach all the desired phone numbers | ``            |

**Important: Both `imageSelector` and `phoneSelector` are required to provide Structured Data for SEO**

### `store-list` and `store-map` props

| Prop name     | Type     | Description                               | Default value          |
| ------------- | -------- | ----------------------------------------- | ---------------------- |
| `filterByTag` | `string` | Filter returned Pickup Points by tag name | `undefined`            |
| `icon`        | `string` | Icon url (`svg` or `png`)                 | `Google's default`     |
| `iconWidth`   | `number` | Number in pixels                          | `Image default width`  |
| `iconHeight`  | `number` | Number in pixels                          | `Image default height` |

### `store-back-link` props

| Prop name | Type     | Description | Default value        |
| --------- | -------- | ----------- | -------------------- |
| `label`   | `string` | Link text   | `Back to all stores` |

### `store-map` props

| Prop name | Type     | Description | Default value |
| --------- | -------- | ----------- | ------------- |
| `width`   | `string` | Map width   | `100%`        |
| `height`  | `string` | Map height  | `200px`       |

### `store-name` props

| Prop name | Type     | Description                                                                             | Default value |
| --------- | -------- | --------------------------------------------------------------------------------------- | ------------- |
| `text`    | `string` | Optional text to display with store name. Use `{storeName}` to display the store's name | `{storeName}` |

### `store-address` props

| Prop name | Type     | Description                 | Default value   |
| --------- | -------- | --------------------------- | --------------- |
| `label`   | `string` | Label for the address block | `Store address` |

### `store-hours` props

| Prop name | Type     | Description                  | Default value |
| --------- | -------- | ---------------------------- | ------------- |
| `label`   | `string` | Label for the hours block    | `Store hours` |
| `format`  | `enum`   | Hour format (`12h` or `24h`) | `24h`         |

### `store-instructions` props

| Prop name | Type     | Description                      | Default value |
| --------- | -------- | -------------------------------- | ------------- |
| `label`   | `string` | Label for the instructions block | `Information` |

### Example

You can use our default [blocks.json](https://github.com/vtex-apps/store-locator/blob/master/store/blocks.json) as an example

## Customization

`In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).`

| CSS Handles             |
| ----------------------- |
| `addressContainer`      |
| `addressLabel`          |
| `addressListFirstItem`  |
| `addressListItem`       |
| `addressListLink`       |
| `addressList`           |
| `addressStoreAddress`   |
| `addressStoreName`      |
| `backlinkContainer`     |
| `backlink`              |
| `businessHours`         |
| `container`             |
| `dayOfWeek`             |
| `divider`               |
| `hourRow`               |
| `hoursContainer`        |
| `hoursLabel`            |
| `instructionsContainer` |
| `instructionsLabel`     |
| `instructionsText`      |
| `listingMapContainer`   |
| `loadAll`               |
| `markerInfoAddress`     |
| `markerInfoLink`        |
| `markerInfoStoreName`   |
| `markerInfo`            |
| `noResults`             |
| `storeName`             |
| `storesListCol`         |
| `storesList`            |
| `storesMapCol`          |

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
