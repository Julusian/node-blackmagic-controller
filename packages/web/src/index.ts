/* eslint-disable n/no-unsupported-features/node-builtins */

import type {
	OpenBlackmagicControllerOptions,
	OpenBlackmagicControllerOptionsInternal,
} from '@blackmagic-controller/core'
import { DEVICE_MODELS, VENDOR_ID } from '@blackmagic-controller/core'
import { WebHIDDevice } from './hid-device.js'
import { BlackmagicControllerWeb } from './wrapper.js'

export {
	VENDOR_ID,
	DeviceModelId,
	KeyId,
	BlackmagicController,
	BlackmagicControllerControlDefinitionBase,
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerTBarControlDefinition,
	BlackmagicControllerControlDefinition,
	OpenBlackmagicControllerOptions,
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
		filters: [
			{
				vendorId: VENDOR_ID,
				// usagePage: 0xff01,
			},
		],
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
	const validDevices = browserDevices.filter((d) => d.vendorId === VENDOR_ID)

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
	const options: Required<OpenBlackmagicControllerOptions> = {
		...userOptions,
	}

	const model = DEVICE_MODELS.find(
		(m) => browserDevice.vendorId === VENDOR_ID && m.productIds.includes(browserDevice.productId),
	)
	if (!model) {
		throw new Error('Stream Deck is of unexpected type.')
	}

	await browserDevice.open()

	let device: WebHIDDevice | undefined
	try {
		device = new WebHIDDevice(browserDevice)

		// Perform authentication if requried by the model
		let nextAuthMaxDelay: number | null = null
		if (model.authenticate) {
			nextAuthMaxDelay = await model.authenticate(device)
		}

		const fullOptions: Required<OpenBlackmagicControllerOptionsInternal> = {
			...options,
			nextAuthMaxDelay,
			authenticate: model.authenticate ?? null,
		}

		const rawSteamdeck = model.factory(device, fullOptions)

		return new BlackmagicControllerWeb(rawSteamdeck, device)
	} catch (e) {
		if (device) await device.close().catch(() => null) // Suppress error
		throw e
	}
}
