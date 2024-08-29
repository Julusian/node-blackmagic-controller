import type { OpenBlackmagicPanelOptions, BlackmagicPanel } from '@elgato-stream-deck/core'
import { DEVICE_MODELS, VENDOR_ID } from '@elgato-stream-deck/core'
import * as HID from 'node-hid'
import { NodeHIDDevice, BlackmagicPanelDeviceInfo } from './hid-device.js'
import { BlackmagicPanelNode } from './wrapper.js'

export {
	VENDOR_ID,
	DeviceModelId,
	KeyIndex,
	StreamDeck,
	LcdPosition,
	Dimension,
	StreamDeckControlDefinitionBase,
	StreamDeckButtonControlDefinition,
	BlackmagicPanelTBarControlDefinition,
	StreamDeckButtonControlDefinitionRgbFeedback,
	BlackmagicPanelControlDefinition,
	StreamDeckEncoderControlDefinition,
	StreamDeckLcdSegmentControlDefinition,
	StreamDeckControlDefinition,
	OpenStreamDeckOptions,
} from '@elgato-stream-deck/core'

export { BlackmagicPanelDeviceInfo }

export interface OpenBlackmagicPanelOptionsNode extends OpenBlackmagicPanelOptions {
	clearOnClose?: boolean // nocommit - implement this
}

/**
 * Scan for and list detected devices
 */
export async function listBlackmagicPanels(): Promise<BlackmagicPanelDeviceInfo[]> {
	const devices: Record<string, BlackmagicPanelDeviceInfo> = {}
	for (const dev of await HID.devicesAsync()) {
		if (dev.path && !devices[dev.path]) {
			const info = getBlackmagicPanelDeviceInfo(dev)
			if (info) devices[dev.path] = info
		}
	}
	return Object.values<BlackmagicPanelDeviceInfo>(devices)
}

/**
 * If the provided device is a streamdeck, get the info about it
 */
export function getBlackmagicPanelDeviceInfo(dev: HID.Device): BlackmagicPanelDeviceInfo | null {
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
 * Get the info of a device if the given path is a streamdeck
 */
export async function getBlackmagicPanelInfo(path: string): Promise<BlackmagicPanelDeviceInfo | undefined> {
	const allDevices = await listBlackmagicPanels()
	return allDevices.find((dev) => dev.path === path)
}

/**
 * Open a streamdeck
 * @param devicePath The path of the device to open.
 * @param userOptions Options to customise the device behvaiour
 */
export async function openBlackmagicPanel(
	devicePath: string,
	userOptions?: OpenBlackmagicPanelOptionsNode,
): Promise<BlackmagicPanel> {
	const options: Required<OpenBlackmagicPanelOptions> = {
		...userOptions,
	}

	let device: NodeHIDDevice | undefined
	try {
		const hidDevice = await HID.HIDAsync.open(devicePath)
		device = new NodeHIDDevice(hidDevice)

		const deviceInfo = await device.getDeviceInfo()

		const model = DEVICE_MODELS.find(
			(m) => deviceInfo.vendorId === VENDOR_ID && m.productIds.includes(deviceInfo.productId),
		)
		if (!model) {
			throw new Error('Stream Deck is of unexpected type.')
		}

		const rawSteamdeck = model.factory(device, options)
		return new BlackmagicPanelNode(rawSteamdeck, userOptions?.clearOnClose ?? false)
	} catch (e) {
		if (device) await device.close().catch(() => null) // Suppress error
		throw e
	}
}
