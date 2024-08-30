# @blackmagic-controller

![Node CI](https://github.com/Julusian/node-blackmagic-controller/workflows/Node%20CI/badge.svg)
[![codecov](https://codecov.io/gh/Julusian/node-blackmagic-controller/branch/master/graph/badge.svg?token=Hl4QXGZJMF)](https://codecov.io/gh/Julusian/node-blackmagic-controller)

[@blackmagic-controller](https://www.npmjs.com/org/elgato-stream-deck) is a collection of libraries for interfacing with the various models of the usb controllers made by [Blackmagic Design](https://www.blackmagicdesign.com/).

## Installing & Usage

Check one of the installable packages for installation and usage instructions:

-   [`@blackmagic-controller/node`](https://npm.im/@blackmagic-controller/node)
-   [`@blackmagic-controller/web`](https://npm.im/@blackmagic-controller/web)

### Have another hid target you wish to use?

The existing implementations are a light wrapper around the platform agnostic [`@blackmagic-controller/core`](https://npm.im/@blackmagic-controller/core). You can use your own HID implementation and device scanning/opening logic and reuse all the streamdeck bits.

## Demo

If you are using a Chromium v89+ based browser, you can try out the [webhid demo](https://julusian.github.io/node-blackmagic-controller/)

## Linux

On linux, the udev subsystem blocks access to the StreamDeck without some special configuration.
Copy one of the following files into `/etc/udev/rules.d/` and reload the rules with `sudo udevadm control --reload-rules`

-   Use the [headless server](./packages/node/udev/50-blackmagic-controller-headless.rules) version when your software will be running as a system service, and is not related to a logged in user
-   Use the [desktop user](./packages/node/udev/50-blackmagic-controller-user.rules) version when your software is run by a user session on a distribution using systemd

Unplug and replug the device and it should be usable

## Contributing

The elgato-stream-deck team enthusiastically welcomes contributions and project participation! There's a bunch of things you can do if you want to contribute! Please don't hesitate to jump in if you'd like to, or even ask us questions if something isn't clear.

Please refer to the [Changelog](CHANGELOG.md) for project history details, too.
