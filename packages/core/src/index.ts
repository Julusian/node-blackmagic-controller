import type { HIDDevice } from './hid-device.js'
import { DeviceModelId } from './id.js'
import type { BlackmagicController } from './types.js'
import type { OpenBlackmagicControllerOptions, OpenBlackmagicControllerOptionsInternal } from './models/base.js'
import { AtemMicroPanelFactory } from './models/atem-micro-panel.js'
import { authenticate } from './authenticate.js'

export * from './types.js'
export * from './id.js'
export * from './controlDefinition.js'
export { HIDDevice, HIDDeviceInfo, HIDDeviceEvents } from './hid-device.js'
export { OpenBlackmagicControllerOptions } from './models/base.js'
export { BlackmagicControllerProxy } from './proxy.js'

/** Blackmagic vendor id */
export const VENDOR_ID = 0x1edb

export interface DeviceModelSpec {
	id: DeviceModelId
	productIds: number[]
	factory: (device: HIDDevice, options: Required<OpenBlackmagicControllerOptionsInternal>) => BlackmagicController

	authenticate?: (device: HIDDevice) => Promise<number>
}

/** List of all the known models, and the classes to use them */
export const DEVICE_MODELS2: { [key in DeviceModelId]: Omit<DeviceModelSpec, 'id'> } = {
	[DeviceModelId.AtemMicroPanel]: {
		productIds: [0xbef0],
		factory: AtemMicroPanelFactory,
		authenticate: (device) => authenticate(device, 5),
	},
}

/** @deprecated maybe? */
export const DEVICE_MODELS: DeviceModelSpec[] = Object.entries<Omit<DeviceModelSpec, 'id'>>(DEVICE_MODELS2).map(
	([id, spec]) => ({
		id: id as any as DeviceModelId,
		...spec,
	}),
)
