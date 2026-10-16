import type { BlackmagicController, BlackmagicControllerDriver } from '@blackmagic-controller/core'
import { findModelByUsb, getDriver } from '@blackmagic-controller/core'
import * as HID from 'node-hid'
import { NodeHIDDevice, BlackmagicControllerDeviceInfo } from './hid-device.js'
import { BlackmagicControllerNode } from './wrapper.js'

export {
	VENDOR_ID,
	BlackmagicControllerModelId,
	getBlackmagicControllerName,
	KeyId,
	BlackmagicController,
	BlackmagicControllerEvents,
	BlackmagicControllerControlDefinitionBase,
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerTBarControlDefinition,
	BlackmagicControllerJogControlDefinition,
	BlackmagicControllerControlBounds,
	BlackmagicControllerSetButtonColorValue,
	BlackmagicControllerSetButtonOnOffValue,
	BlackmagicControllerSetButtonSomeValue,
	BlackmagicControllerControlDefinition,
	OpenBlackmagicControllerOptions,
	Dimension,
	BlackmagicControllerModelInfo,
	BlackmagicControllerModelFeatures,
	BlackmagicControllerTransport,
	UsbMatch,
	DEVICE_MODEL_INFO,
	getModelInfo,
	findModelByUsb,
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
	const model = findModelByUsb(dev.vendorId, dev.productId, dev.usage, dev.interface)
	if (!model || !dev.path) return null

	return {
		modelInfo: model,
		model: model.id,
		path: dev.path,
		serialNumber: dev.serialNumber,
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
	let driver: BlackmagicControllerDriver | undefined
	try {
		hidDevice = await HID.HIDAsync.open(devicePath)

		const deviceInfo = await hidDevice.getDeviceInfo()
		const model = findModelByUsb(deviceInfo.vendorId, deviceInfo.productId)
		driver = model && getDriver(model.id)
		if (!driver) {
			throw new Error(`Device path at "${devicePath}" is not a supported Blackmagic controller.`)
		}
	} catch (e) {
		if (hidDevice) await hidDevice.close().catch(() => null) // Suppress error
		throw e
	}

	let device: NodeHIDDevice | undefined
	try {
		device = new NodeHIDDevice(hidDevice)

		const rawController = await driver(device)

		return new BlackmagicControllerNode(rawController, userOptions?.clearOnClose ?? false)
	} catch (e) {
		if (device) await device.close().catch(() => null) // Suppress error
		throw e
	}
}
