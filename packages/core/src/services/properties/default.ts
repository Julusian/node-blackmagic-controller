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

	public async setBrightness(percentage: number): Promise<void> {
		if (percentage < 0 || percentage > 100) {
			throw new RangeError('Expected brightness percentage to be between 0 and 100')
		}

		const maxBrightness = 0x3f800000
		const minBrightness = 0x3c23d70a

		// const brightness = minBrightness + (maxBrightness - minBrightness) * (percentage / 100)
		const brightness = maxBrightness

		const buffer = new Uint8Array(5)
		const view = uint8ArrayToDataView(buffer)
		view.setUint8(0, 0x00)
		view.setUint32(1, brightness, true)

		// TODO - this looks like how it should be formed, but it isn't right

		// await this.#device.sendFeatureReport(buffer)
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
