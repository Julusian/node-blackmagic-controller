/* eslint-disable n/no-unsupported-features/node-builtins */

import type { OpenBlackmagicControllerOptions } from '@blackmagic-controller/core'
import { DEVICE_MODEL_INFO, findModelByUsb, getDriver } from '@blackmagic-controller/core'
import { WebHIDDevice } from './hid-device.js'
import { BlackmagicControllerWeb } from './wrapper.js'

export {
	VENDOR_ID,
	BlackmagicControllerModelId,
	KeyId,
	BlackmagicController,
	BlackmagicControllerControlDefinitionBase,
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerTBarControlDefinition,
	BlackmagicControllerJogControlDefinition,
	BlackmagicControllerControlBounds,
	BlackmagicControllerControlDefinition,
	OpenBlackmagicControllerOptions,
	Dimension,
	BlackmagicControllerModelType,
	BlackmagicControllerModelInfo,
	BlackmagicControllerModelFeatures,
	BlackmagicControllerTransport,
	UsbMatch,
	DEVICE_MODEL_INFO,
	getModelInfo,
	findModelByUsb,
} from '@blackmagic-controller/core'
export { BlackmagicControllerWeb } from './wrapper.js'

/**
 * Request the user to select some blackmagiccontrollers to open
 * @param userOptions Options to customise the device behvaiour
 */
export async function requestBlackmagicControllers(
	options?: OpenBlackmagicControllerOptions,
): Promise<BlackmagicControllerWeb[]> {
	// TODO - error handling
	const browserDevices = await navigator.hid.requestDevice({
		filters: Object.values(DEVICE_MODEL_INFO).flatMap((model) =>
			model.usb.map((match) => ({ vendorId: match.vendorId, productId: match.productId })),
		),
	})

	return Promise.all(browserDevices.map(async (dev) => openDevice(dev, options)))
}

/**
 * Reopen previously selected blackmagiccontrollers.
 * The browser remembers what the user previously allowed your site to access, and this will open those without the request dialog
 * @param options Options to customise the device behvaiour
 */
export async function getBlackmagicControllers(
	options?: OpenBlackmagicControllerOptions,
): Promise<BlackmagicControllerWeb[]> {
	const browserDevices = await navigator.hid.getDevices()
	console.log('devs', browserDevices)
	const validDevices = browserDevices.filter((d) => !!findModelByUsb(d.vendorId, d.productId))

	const resultDevices = await Promise.all(
		validDevices.map(async (dev) =>
			openDevice(dev, options).catch((e) => {
				console.log('Failed to open device2', e)
			}),
		), // Ignore failures
	)

	return resultDevices.filter((v): v is BlackmagicControllerWeb => !!v)
}

/**
 * Open a BlackmagicController from a manually selected HIDDevice handle
 * @param browserDevice The unopened browser HIDDevice
 * @param userOptions Options to customise the device behvaiour
 */
export async function openDevice(
	browserDevice: HIDDevice,
	userOptions?: OpenBlackmagicControllerOptions,
): Promise<BlackmagicControllerWeb> {
	const model = findModelByUsb(browserDevice.vendorId, browserDevice.productId)
	const driver = model && getDriver(model.id)
	if (!driver) {
		throw new Error('Device is not a supported Blackmagic controller.')
	}

	await browserDevice.open()

	let device: WebHIDDevice | undefined
	try {
		device = new WebHIDDevice(browserDevice)

		const rawController = await driver(device, userOptions)

		return new BlackmagicControllerWeb(rawController, device)
	} catch (e) {
		if (device) await device.close().catch(() => null) // Suppress error
		throw e
	}
}
