import { uint8ArrayToDataView } from '../../util.js'
import type { HIDDevice } from '../../hid-device.js'
import type { PropertiesService } from './interface.js'

export interface DefaultPropertiesServiceOptions {
	batteryReportId: number
	firmwareReportId: number
	serialReportId: number
}

export class DefaultPropertiesService implements PropertiesService {
	readonly #device: HIDDevice
	readonly #options: Readonly<DefaultPropertiesServiceOptions>

	constructor(device: HIDDevice, options: Readonly<DefaultPropertiesServiceOptions>) {
		this.#device = device
		this.#options = options
	}

	public async getBatteryLevel(): Promise<number | null> {
		const val = await this.#device.getFeatureReport(this.#options.batteryReportId, 3)
		return val[2] / 100
	}

	public async getFirmwareVersion(): Promise<string> {
		const val = await this.#device.getFeatureReport(this.#options.firmwareReportId, 8)
		const view = uint8ArrayToDataView(val)

		// Generate a semver format string
		return `${view.getUint8(5)}.${view.getUint8(6)}.${view.getUint8(7)}+${view.getUint32(1, true).toString(16)}`
	}

	public async getSerialNumber(): Promise<string> {
		const val = await this.#device.getFeatureReport(this.#options.serialReportId, 33)
		return new TextDecoder('ascii').decode(val.subarray(1))
	}
}
