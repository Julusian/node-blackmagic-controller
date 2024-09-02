# @blackmagic-controller/node

![Node CI](https://github.com/Julusian/node-blackmagic-controller/workflows/Node%20CI/badge.svg)
[![codecov](https://codecov.io/gh/Julusian/node-blackmagic-controller/branch/master/graph/badge.svg?token=Hl4QXGZJMF)](https://codecov.io/gh/Julusian/node-blackmagic-controller)

[![npm version](https://img.shields.io/npm/v/@blackmagic-controller/node.svg)](https://npm.im/@blackmagic-controller/node)
[![license](https://img.shields.io/npm/l/@blackmagic-controller/node.svg)](https://npm.im/@blackmagic-controller/node)

[`@blackmagic-controller/node`](https://github.com/julusian/node-blackmagic-controller) is a shared library for interfacing
with the various models of the [Blackmagic usb/bluetooth controllers](https://www.blackmagicdesign.com/products).

## Install

`$ npm install --save @blackmagic-controller/node`

### Native dependencies

All of this library's native dependencies ship with prebuilt binaries, so having a full compiler toolchain should not be necessary to install `@blackmagic-controller/node`.

## Linux

On linux, the udev subsystem blocks access to the BlackmagicController without some special configuration.
Copy one of the following files into `/etc/udev/rules.d/` and reload the rules with `sudo udevadm control --reload-rules`

-   Use the [headless server](./udev/50-blackmagic-controller-headless.rules) version when your software will be running as a system service, and is not related to a logged in user
-   Use the [desktop user](./udev/50-blackmagic-controller-user.rules) version when your software is run by a user session on a distribution using systemd

Unplug and replug the device and it should be usable

## Features

-   Multiplatform support: Windows, MacOS, Linux, and even Raspberry Pi!
-   TypeScript support
-   Full hardware functionality support
-   Supports Atem Micro Panel

## API

The root methods exposed by the library are as follows. For more information it is recommended to rely on the typescript typings for hints or to browse through the source to see what methods are available

```typescript
/**
 * Scan for and list detected devices
 */
export function listBlackmagicControllers(): Promise<BlackmagicControllerDeviceInfo[]>

/**
 * Get the info of a device if the given path is a blackmagiccontroller
 */
export function getBlackmagicControllerInfo(path: string): Promise<BlackmagicControllerDeviceInfo | undefined>

/**
 * Open a blackmagic-controller
 * @param devicePath The path of the device to open.
 * @param userOptions Options to customise the device behvaiour
 */
export function openBlackmagicController(
	devicePath: string,
	userOptions?: OpenBlackmagicControllerOptionsNode,
): Promise<BlackmagicController>
```

The BlackmagicController type can be found [here](/packages/core/src/models/types.ts#L15)

## Example

```typescript
import { openBlackmagicController, listBlackmagicControllers } from '@blackmagic-controller/node'

// List the connected blackmagiccontrollers
const devices = await listBlackmagicControllers()
if (devices.length === 0) throw new Error('No blackmagiccontrollers connected!')

// You must provide the devicePath yourself as the first argument to the constructor.
// For example: const myBlackmagicController = new BlackmagicController('\\\\?\\hid#vid_05f3&pid_0405&mi_00#7&56cf813&0&0000#{4d1e55b2-f16f-11cf-88cb-001111000030}')
// On linux the equivalent would be: const myBlackmagicController = new BlackmagicController('0001:0021:00')
const myBlackmagicController = await openBlackmagicController(devices[0].path)

myBlackmagicController.on('down', (keyIndex) => {
	console.log('key %d down', keyIndex)
})

myBlackmagicController.on('up', (keyIndex) => {
	console.log('key %d up', keyIndex)
})

// Fired whenever an error is detected by the `node-hid` library.
// Always add a listener for this event! If you don't, errors will be silently dropped.
myBlackmagicController.on('error', (error) => {
	console.error(error)
})

// Fill the first button form the left in the first row with a solid red color. This is asynchronous.
await myBlackmagicController.setButtonColor('preview4', true, false, false)
console.log('Successfully wrote a red square to preview4.')
```

Some more complex demos can be found in the [examples](examples/) folder.

## Contributing

The blackmagic-controller team enthusiastically welcomes contributions and project participation! There's a bunch of things you can do if you want to contribute! Please don't hesitate to jump in if you'd like to, or even ask us questions if something isn't clear.

Please refer to the [Changelog](CHANGELOG.md) for project history details, too.
