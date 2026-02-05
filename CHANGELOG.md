## [1.0.1](https://github.com/asachs01/node-superops/compare/v1.0.0...v1.0.1) (2026-02-05)


### Bug Fixes

* Add missing ESLint dependencies ([ba19525](https://github.com/asachs01/node-superops/commit/ba19525245060c06823478a45de5eaec7c859342))

# 1.0.0 (2026-02-05)


### Bug Fixes

* Add semantic-release plugins as devDependencies ([77ed655](https://github.com/asachs01/node-superops/commit/77ed65593d7d2e652b27d14d1c8a5b005822812e))


### Features

* Add semantic-release for GitHub Packages publishing ([6221a7f](https://github.com/asachs01/node-superops/commit/6221a7f61c8b689b240b0fe33f242228b24605dc))
* Initial release of node-superops TypeScript library ([443c430](https://github.com/asachs01/node-superops/commit/443c43094ca61eecf3e22489eed161a4d441f695))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-02-04

### Added

- Initial release of node-superops
- Complete TypeScript library for SuperOps.ai GraphQL API
- Core functionality:
  - SuperOpsClient main client class
  - GraphQL client with authentication
  - Rate limiter (800 req/min)
  - Cursor-based pagination with async iterators
  - Typed error classes
- Resource implementations:
  - Assets - CRUD operations, list by client/site
  - Tickets - CRUD, notes, time entries, status changes, assignments
  - Clients - CRUD, search, archive
  - Sites - CRUD, list by client
  - Alerts - List, acknowledge, resolve, dismiss
  - Contracts - CRUD, renewal
  - Technicians - List, availability
  - Knowledge Base - Articles, collections, search
  - Runbooks - List, execute, status
  - Patches - List, approve, schedule deployments
  - Remote Sessions - Initiate, terminate
  - Reports - Ticket metrics, asset summary, technician performance, health scores
- Multi-region support (US/EU for MSP/IT verticals)
- Full test suite with MSW mocks
- Comprehensive TypeScript types
- README documentation with examples

[Unreleased]: https://github.com/asachs01/node-superops/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/asachs01/node-superops/releases/tag/v0.1.0
