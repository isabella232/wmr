# wmr

## 1.4.0

### Minor Changes

- [`cb26519`](https://github.com/preactjs/wmr/commit/cb2651974c922c10c520a1c56de39ac3c2b05511) [#438](https://github.com/preactjs/wmr/pull/438) Thanks [@marvinhagemeister](https://github.com/marvinhagemeister)! - Update plugin format to extend options by deep-merging return values instead of manually pushing into arrays. This makes user plugins shorter and less error prone. In doing so we do support return an array of plugins from a plugin. The returned array will be flattened into the existing one. To be able to specify execution points a `plugin.enforce` property was added.

* [`eed537d`](https://github.com/preactjs/wmr/commit/eed537df6f4a8bb55e822b4645278beee366b07c) [#435](https://github.com/preactjs/wmr/pull/435) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Report errored JS-lines to the client.

- [`44d5a83`](https://github.com/preactjs/wmr/commit/44d5a835aa08fc4e4497706045ce26ba13108b0a) [#461](https://github.com/preactjs/wmr/pull/461) Thanks [@piotr-cz](https://github.com/piotr-cz)! - Fix Eslint and Prettier suggestions

* [`111c1be`](https://github.com/preactjs/wmr/commit/111c1be36cc27428df72d4e73964157c90218d82) [#389](https://github.com/preactjs/wmr/pull/389) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Use resolve.exports for export map resolving in the npm-plugin

### Patch Changes

- [`b225cc2`](https://github.com/preactjs/wmr/commit/b225cc24a5683380b26e48ff8f276b1f2e2525d2) [#430](https://github.com/preactjs/wmr/pull/430) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix reload issue, when the bubbling hmr doesn't find a proper boundary it will give the browser a refresh signal (F5) which needs to clear the module-graph as modules could still be marked as stale which wouldn't be needed

* [`3fa2aeb`](https://github.com/preactjs/wmr/commit/3fa2aebf4447c349e7a70eeed9736c2060236916) [#441](https://github.com/preactjs/wmr/pull/441) Thanks [@marvinhagemeister](https://github.com/marvinhagemeister)! - Add colored namespaces to debug output when `DEBUG=true` is set.

- [`2102ffb`](https://github.com/preactjs/wmr/commit/2102ffb4807e04c4858fc28ed5e1463e38ee3a1f) [#409](https://github.com/preactjs/wmr/pull/409) Thanks [@aduh95](https://github.com/aduh95)! - Fix double quotes imports with bundle-plugin

* [`4d36e2a`](https://github.com/preactjs/wmr/commit/4d36e2a42884784517a047930b955724cebac6ba) [#427](https://github.com/preactjs/wmr/pull/427) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix case where the module-graph would become stale if two co-dependent modules would import the same file, when this file would get updated we'd only cache-bust the import in one of those two files making the graph stale. One file updates the old version and the other updates the new one.

- [`2405b8c`](https://github.com/preactjs/wmr/commit/2405b8c0569cdcf738122a79c451e1a3cff1b630) [#437](https://github.com/preactjs/wmr/pull/437) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Support Typescript config files

* [`5ae39be`](https://github.com/preactjs/wmr/commit/5ae39be2fe62e597abdea0d3ac1e3a212efc990b) [#453](https://github.com/preactjs/wmr/pull/453) Thanks [@marvinhagemeister](https://github.com/marvinhagemeister)! - Align astronaut emoji with addresses in startup message

- [`bcf3bdf`](https://github.com/preactjs/wmr/commit/bcf3bdf8f4556a621f6470c39c05e041e41d4f5a) [#433](https://github.com/preactjs/wmr/pull/433) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Newly created files shouldn't cause a page-reload

* [`baa85c7`](https://github.com/preactjs/wmr/commit/baa85c7acbd8706b64d07741040a5773b248d25a) [#450](https://github.com/preactjs/wmr/pull/450) Thanks [@marvinhagemeister](https://github.com/marvinhagemeister)! - This PR adds a redesigned startup screen to make it easier to read addresses at a glance.

- [`edf9106`](https://github.com/preactjs/wmr/commit/edf9106a6e1767d288572e4967f749958c7b484c) [#442](https://github.com/preactjs/wmr/pull/442) Thanks [@marvinhagemeister](https://github.com/marvinhagemeister)! - Don't resolve config file twice during compilation

## 1.3.2

### Patch Changes

- [`7fc6570`](https://github.com/preactjs/wmr/commit/7fc6570134b6aa0c9da06ab16b95569a6563ee9f) [#393](https://github.com/preactjs/wmr/pull/393) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - remove search parameters from pre-rendered url's

* [`2f88ebf`](https://github.com/preactjs/wmr/commit/2f88ebf441a87fe82e6cd298693ade92fbf9595e) [#396](https://github.com/preactjs/wmr/pull/396) Thanks [@piotr-cz](https://github.com/piotr-cz)! - Fix source maps in styles-plugin

- [`42fa940`](https://github.com/preactjs/wmr/commit/42fa94027c0adc05b1e05b364010eb39203a12e8) [#385](https://github.com/preactjs/wmr/pull/385) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix case where deduped css would crash the bundle

* [`8a5a475`](https://github.com/preactjs/wmr/commit/8a5a4750512037984a4f06c78545e45c845b6be2) [#397](https://github.com/preactjs/wmr/pull/397) Thanks [@piotr-cz](https://github.com/piotr-cz)! - Move sourcemap option from start to build command

- [`a32d855`](https://github.com/preactjs/wmr/commit/a32d855683358f806b0962d0b4ee40e7aa7df691) [#387](https://github.com/preactjs/wmr/pull/387) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Convert Set to Array before calling .every for hmr

## 1.3.1

### Patch Changes

- [`c740ac0`](https://github.com/preactjs/wmr/commit/c740ac0cb611d4b2979a4b9413bd5abb901e776b) [#370](https://github.com/preactjs/wmr/pull/370) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix non-js hmr

* [`c740ac0`](https://github.com/preactjs/wmr/commit/c740ac0cb611d4b2979a4b9413bd5abb901e776b) [#370](https://github.com/preactjs/wmr/pull/370) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix support for scss/sass hmr

## 1.3.0

### Minor Changes

- [`ed47713`](https://github.com/preactjs/wmr/commit/ed47713ed059f6fcac95e2d49d1c93e0999296fb) [#262](https://github.com/preactjs/wmr/pull/262) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Handle hmr on the development server, this enables bubbling in hmr signals that aren't accepted.

* [`a735d19`](https://github.com/preactjs/wmr/commit/a735d19e9d0d3c89e7a52345795e4767134f54ed) [#330](https://github.com/preactjs/wmr/pull/330) Thanks [@developit](https://github.com/developit)! - Add prerendering of <head>, support .html URLs

### Patch Changes

- [`cd2112c`](https://github.com/preactjs/wmr/commit/cd2112c5ea73f4c7ba151f22175bc35cfced15e7) [#347](https://github.com/preactjs/wmr/pull/347) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix config loading on Windows

* [`bf6e97a`](https://github.com/preactjs/wmr/commit/bf6e97a5cf08876f08d3e11a123c53c8f34fdd20) [#344](https://github.com/preactjs/wmr/pull/344) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Don't cache plugin files
