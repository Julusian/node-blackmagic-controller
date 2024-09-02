import { uint8ArrayToDataView } from '../../util.js'
import type { HIDDevice } from '../../hid-device.js'
import type { PropertiesService } from './interface.js'

export class DefaultPropertiesService implements PropertiesService {
	readonly #device: HIDDevice

	constructor(device: HIDDevice) {
		this.#device = device
	}

	public async getBatteryLevel(): Promise<number | null> {
		const val = await this.#device.getFeatureReport(6, 3)
		return val[2] / 100
	}

	public async getFirmwareVersion(): Promise<string> {
		const val = await this.#device.getFeatureReport(1, 9)
		const view = uint8ArrayToDataView(val)

		// Generate a semver format string
		return `${view.getUint8(5)}.${view.getUint8(6)}.${view.getUint8(7)}+${view.getUint32(1, true).toString(16)}`
	}

	public async getSerialNumber(): Promise<string> {
		const val = await this.#device.getFeatureReport(7, 33)
		return new TextDecoder('ascii').decode(val.subarray(1))
	}
}
