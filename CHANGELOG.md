# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added

- Wrap address and number
- CSS Handless `addressStoreAddressGroupA`, `addressStoreAddressNumber`, `addressStoreAddressStreet`

## [0.8.0] - 2021-03-09

### Added

- Description meta tag

## [0.7.1] - 2021-03-04

### Fixed

- Filter active pickup points at the backend

## [0.7.0] - 2021-03-04

### Fixed

- Disabled pickup points being displayed

## [0.6.4] - 2021-02-25

### Fixed

- App description
- Unused code

## [0.6.3] - 2021-02-03

### Added

- Metadata to app store

## [0.6.2] - 2021-02-03

### Added

- Additional dynamic data available in Page Title

## [0.6.1] - 2021-02-01

### Fixed

- Missing Store Description interface

## [0.6.0] - 2021-02-01

### Added

- Store adress as Google map link
- Store Description block
- Replace phone number css selector with optional boolean in theme
- Provide store City and State as dynamic values in Store Name block

## [0.5.1] - 2021-01-21

### Removed

- Removed default title from the App's `routes.json`

## [0.5.0] - 2020-12-16

### Added

- Creates new index on the `sitemap.xml` for the list of stores

### Updated

- Document update

## [0.4.4] - 2020-11-23

### Fixed

- Update app documentation

## [0.4.3] - 2020-11-20

### Fixed

- Falls back to Load All Stores if there's an error loading the closest stores

## [0.4.2] - 2020-11-19

### Fixed

- Error loading stores when user is identified but not logged in

## [0.4.1] - 2020-11-16

### Added

- Documentation update

## [0.4.0] - 2020-11-04

### Added

- CSS selector for Store Instructions text
- Display closed days in Store Hours
- Add optional text prop to Store Name

## [0.3.0] - 2020-10-27

### Added

- Add Pickup Point filter by tag name

## [0.2.0] - 2020-10-06

### Added

- Store sitemap file `/sitemap/store-locator.xml`

## [0.1.0] - 2020-10-05

### Added

- `icon`, `iconWidth` and `iconHeight` props to the interfaces `store-list` and `store-map`
- `title`, `imageSelector` and `phoneSelector` props to the `store-group` interface
- Local Business **Structured Data** for SEO

### Fixed

- Address number not showing on the listing component

## [0.0.6] - 2020-10-01

### Added

- CSS Handle `listingMapContainer`

## [0.0.5] - 2020-10-01

### Updated

- Doc update

### Added

- Postal Code to the listing
- Tooltip to the centered marker

### Fixed

- Hours showing 12am instead of 12pm

## [0.0.1] - 2020-09-29

### Added

- Intial release.
