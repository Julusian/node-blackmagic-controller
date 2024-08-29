# @blackmagic-panel/node

![Node CI](https://github.com/Julusian/node-blackmagic-panel/workflows/Node%20CI/badge.svg)
[![codecov](https://codecov.io/gh/Julusian/node-blackmagic-panel/branch/master/graph/badge.svg?token=Hl4QXGZJMF)](https://codecov.io/gh/Julusian/node-blackmagic-panel)

[![npm version](https://img.shields.io/npm/v/@blackmagic-panel/node.svg)](https://npm.im/@blackmagic-panel/node)
[![license](https://img.shields.io/npm/l/@blackmagic-panel/node.svg)](https://npm.im/@blackmagic-panel/node)

[`@blackmagic-panel/node`](https://github.com/julusian/node-blackmagic-panel) is a shared library for interfacing
with the various models of the [Elgato Stream Deck](https://www.elgato.com/en/gaming/stream-deck).

## Intended use

This library has nothing to do with the streamdeck software produced by Elgato. There is nothing here to install and run. This is a library to help developers make alternatives to that software

## Install

`$ npm install --save @blackmagic-panel/node`

### Native dependencies

All of this library's native dependencies ship with prebuilt binaries, so having a full compiler toolchain should not be necessary to install `@blackmagic-panel/node`.

## Linux

On linux, the udev subsystem blocks access to the StreamDeck without some special configuration.
Copy one of the following files into `/etc/udev/rules.d/` and reload the rules with `sudo udevadm control --reload-rules`

-   Use the [headless server](./udev/50-blackmagic-panel-headless.rules) version when your software will be running as a system service, and is not related to a logged in user
-   Use the [desktop user](./udev/50-blackmagic-panel-user.rules) version when your software is run by a user session on a distribution using systemd

Unplug and replug the device and it should be usable

## Features

-   Multiplatform support: Windows, MacOS, Linux, and even Raspberry Pi!
-   Support for every StreamDeck model (Original, Mini & XL)
-   Key `down` and key `up` events
-   Fill keys with images or solid RGB colors
-   Fill the entire panel with a single image, spread across all keys
-   Set the Stream Deck brightness
-   TypeScript support

## API

The root methods exposed by the library are as follows. For more information it is recommended to rely on the typescript typings for hints or to browse through the source to see what methods are available

```typescript
/**
 * Scan for and list detected devices
 */
export function listStreamDecks(): Promise<StreamDeckDeviceInfo[]>

/**
 * Get the info of a device if the given path is a streamdeck
 */
export function getStreamDeckInfo(path: string): Promise<StreamDeckDeviceInfo | undefined>

/**
 * Open a streamdeck
 * @param devicePath The path of the device to open.
 * @param userOptions Options to customise the device behvaiour
 */
export function openStreamDeck(devicePath: string, userOptions?: OpenStreamDeckOptionsNode): Promise<StreamDeck>
```

The StreamDeck type can be found [here](/packages/core/src/models/types.ts#L15)

## Example

```typescript
import { openStreamDeck, listStreamDecks } from '@blackmagic-panel/node'

// List the connected streamdecks
const devices = await listStreamDecks()
if (devices.length === 0) throw new Error('No streamdecks connected!')

// You must provide the devicePath yourself as the first argument to the constructor.
// For example: const myStreamDeck = new StreamDeck('\\\\?\\hid#vid_05f3&pid_0405&mi_00#7&56cf813&0&0000#{4d1e55b2-f16f-11cf-88cb-001111000030}')
// On linux the equivalent would be: const myStreamDeck = new StreamDeck('0001:0021:00')
const myStreamDeck = await openStreamDeck(devices[0].path)

myStreamDeck.on('down', (keyIndex) => {
	console.log('key %d down', keyIndex)
})

myStreamDeck.on('up', (keyIndex) => {
	console.log('key %d up', keyIndex)
})

// Fired whenever an error is detected by the `node-hid` library.
// Always add a listener for this event! If you don't, errors will be silently dropped.
myStreamDeck.on('error', (error) => {
	console.error(error)
})

// Fill the first button form the left in the first row with a solid red color. This is asynchronous.
await myStreamDeck.fillKeyColor(4, 255, 0, 0)
console.log('Successfully wrote a red square to key 4.')
```

Some more complex demos can be found in the [examples](examples/) folder.

## Contributing

The elgato-stream-deck team enthusiastically welcomes contributions and project participation! There's a bunch of things you can do if you want to contribute! Please don't hesitate to jump in if you'd like to, or even ask us questions if something isn't clear.

Please refer to the [Changelog](CHANGELOG.md) for project history details, too.
