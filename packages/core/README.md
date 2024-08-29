# @blackmagic-panel/core

![Node CI](https://github.com/Julusian/node-blackmagic-panel/workflows/Node%20CI/badge.svg)
[![codecov](https://codecov.io/gh/Julusian/node-blackmagic-panel/branch/master/graph/badge.svg?token=Hl4QXGZJMF)](https://codecov.io/gh/Julusian/node-blackmagic-panel)

[![npm version](https://img.shields.io/npm/v/@blackmagic-panel/core.svg)](https://npm.im/@blackmagic-panel/core)
[![license](https://img.shields.io/npm/l/@blackmagic-panel/core.svg)](https://npm.im/@blackmagic-panel/core)

[`@blackmagic-panel/core`](https://github.com/julusian/node-blackmagic-panel) is a shared library for interfacing
with the various models of the [Elgato Stream Deck](https://www.elgato.com/en/gaming/stream-deck).

You should not be importing this package directly, instead you will want to do so via one of the wrapper libraries to provide the appropriate HID bindings for your target platform:

-   [`@blackmagic-panel/node`](https://npm.im/@blackmagic-panel/node)
-   [`@blackmagic-panel/web`](https://npm.im/@blackmagic-panel/web)
