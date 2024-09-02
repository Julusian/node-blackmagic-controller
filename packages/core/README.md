# @blackmagic-controller/core

![Node CI](https://github.com/Julusian/node-blackmagic-controller/workflows/Node%20CI/badge.svg)
[![codecov](https://codecov.io/gh/Julusian/node-blackmagic-controller/branch/master/graph/badge.svg?token=Hl4QXGZJMF)](https://codecov.io/gh/Julusian/node-blackmagic-controller)

[![npm version](https://img.shields.io/npm/v/@blackmagic-controller/core.svg)](https://npm.im/@blackmagic-controller/core)
[![license](https://img.shields.io/npm/l/@blackmagic-controller/core.svg)](https://npm.im/@blackmagic-controller/core)

[`@blackmagic-controller/core`](https://github.com/julusian/node-blackmagic-controller) is a shared library for interfacing
with the various models of the [Blackmagic usb/bluetooth controllers](https://www.blackmagicdesign.com/products).

You should not be importing this package directly, instead you will want to do so via one of the wrapper libraries to provide the appropriate HID bindings for your target platform:

-   [`@blackmagic-controller/node`](https://npm.im/@blackmagic-controller/node)
-   [`@blackmagic-controller/web`](https://npm.im/@blackmagic-controller/web) (Not yet ready for use)
