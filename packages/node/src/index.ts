import type {
	OpenBlackmagicControllerOptionsInternal,
	BlackmagicController,
	DeviceModelSpec,
} from '@blackmagic-controller/core'
import { DEVICE_MODELS, VENDOR_ID } from '@blackmagic-controller/core'
import * as HID from 'node-hid'
import { NodeHIDDevice, BlackmagicControllerDeviceInfo } from './hid-device.js'
import { BlackmagicControllerNode } from './wrapper.js'

export {
	VENDOR_ID,
	DeviceModelId,
	KeyId,
	BlackmagicController,
	BlackmagicControllerEvents,
	BlackmagicControllerControlDefinitionBase,
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerTBarControlDefinition,
	BlackmagicControllerSetButtonColorValue,
	BlackmagicControllerSetButtonOnOffValue,
	BlackmagicControllerSetButtonSomeValue,
	BlackmagicControllerControlDefinition,
	OpenBlackmagicControllerOptions,
} from '@blackmagic-controller/core'

export { BlackmagicControllerDeviceInfo }

export interface OpenBlackmagicControllerOptionsNode /* extends OpenBlackmagicControllerOptions*/ {
	clearOnClose?: boolean
}

/**
 * Scan for and list detected devices
 */
export async function listBlackmagicControllers(): Promise<BlackmagicControllerDeviceInfo[]> {
	const devices: Record<string, BlackmagicControllerDeviceInfo> = {}
	for (const dev of await HID.devicesAsync()) {
		if (dev.path && !devices[dev.path]) {
			const info = getBlackmagicControllerDeviceInfo(dev)
			if (info) devices[dev.path] = info
		}
	}
	return Object.values<BlackmagicControllerDeviceInfo>(devices)
}

/**
 * If the provided device is a supported blackmagic controller, get the info about it
 */
export function getBlackmagicControllerDeviceInfo(dev: HID.Device): BlackmagicControllerDeviceInfo | null {
	const model = DEVICE_MODELS.find((m) => m.productIds.includes(dev.productId))

	if (model && dev.vendorId === VENDOR_ID && dev.path) {
		return {
			model: model.id,
			path: dev.path,
			serialNumber: dev.serialNumber,
		}
	} else {
		return null
	}
}

/**
 * Get the info of a device if the given path is a supported blackmagic controller
 */
export async function getBlackmagicControllerInfo(path: string): Promise<BlackmagicControllerDeviceInfo | undefined> {
	const allDevices = await listBlackmagicControllers()
	return allDevices.find((dev) => dev.path === path)
}

/**
 * Open a supported blackmagic controller
 * @param devicePath The path of the device to open.
 * @param userOptions Options to customise the device behvaiour
 */
export async function openBlackmagicController(
	devicePath: string,
	userOptions?: OpenBlackmagicControllerOptionsNode,
): Promise<BlackmagicController> {
	// const options: Required<OpenBlackmagicControllerOptions> = {
	// 	...userOptions,
	// }

	let hidDevice: HID.HIDAsync | undefined
	let model: DeviceModelSpec | undefined
	try {
		hidDevice = await HID.HIDAsync.open(devicePath)

		const deviceInfo = await hidDevice.getDeviceInfo()
		model = DEVICE_MODELS.find(
			(m) => deviceInfo.vendorId === VENDOR_ID && m.productIds.includes(deviceInfo.productId),
		)
		if (!model) {
			throw new Error(`Device path at "${devicePath}" is not a supported Blackmagic controller.`)
		}
	} catch (e) {
		if (hidDevice) await hidDevice.close().catch(() => null) // Suppress error
		throw e
	}

	let device: NodeHIDDevice | undefined
	try {
		device = new NodeHIDDevice(hidDevice)

		// Perform authentication if requried by the model
		let nextAuthMaxDelay: number | null = null
		if (model.authenticate) {
			nextAuthMaxDelay = await model.authenticate(device)
		}

		const fullOptions: Required<OpenBlackmagicControllerOptionsInternal> = {
			// ...options,
			nextAuthMaxDelay,
			authenticate: model.authenticate ?? null,
		}

		const rawSteamdeck = model.factory(device, fullOptions)

		return new BlackmagicControllerNode(rawSteamdeck, userOptions?.clearOnClose ?? false)
	} catch (e) {
		if (device) await device.close().catch(() => null) // Suppress error
		throw e
	}
}
