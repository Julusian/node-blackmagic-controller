import type { BlackmagicControllerModelId } from './info.js'
import { DEVICE_MODEL_INFO } from './modelInfo.js'

export * from './types.js'
export * from './info.js'
export * from './controlDefinition.js'
export { HIDDevice, HIDDeviceInfo, HIDDeviceEvents } from './hid-device.js'
export { OpenBlackmagicControllerOptions, OpenBlackmagicControllerOptionsInternal } from './models/base.js'
export { BlackmagicControllerProxy } from './proxy.js'

export { VENDOR_ID, DEVICE_MODEL_INFO, getModelInfo, findModelByUsb } from './modelInfo.js'
export type {
	BlackmagicControllerModelInfo,
	BlackmagicControllerModelFeatures,
	BlackmagicControllerTransport,
	UsbMatch,
} from './modelInfo.js'

export { DEVICE_MODELS, DEVICE_MODELS2, getDriver } from './registry.js'
export type { DeviceModelSpec, BlackmagicControllerDriver } from './registry.js'

/**
 * @deprecated Use `getModelInfo(id)?.name` instead
 */
export function getBlackmagicControllerName(modelId: BlackmagicControllerModelId): string {
	return DEVICE_MODEL_INFO[modelId]?.name || 'Unknown Blackmagic Controller'
}
