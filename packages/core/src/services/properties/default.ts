import { uint8ArrayToDataView } from '../../util.js'
import type { HIDDevice } from '../../hid-device.js'
import type { PropertiesService } from './interface.js'

export interface DefaultPropertiesServiceOptions {
	batteryReportId: number | null
	firmwareReportId: number
	serialReportId: number
	jogReportId?: number
}

export enum BlackmagicControllerJogModes {
	RELATIVE_0 = 0, //Velocity mode 0. Stationary values between -1440 and 1440. Full range c. -250000 to +250000
	ABSOLUTE = 1, //Three-step mode: -4096 / 0 / +4096 in half a turn. No in-between values
	RELATIVE_2 = 2, //Appears same as RELATIVE_0
	ABSOLUTE_DEADZERO = 3, //Appears same as ABSOLUTE
}

export class DefaultPropertiesService implements PropertiesService {
	readonly #device: HIDDevice
	readonly #options: Readonly<DefaultPropertiesServiceOptions>

	constructor(device: HIDDevice, options: Readonly<DefaultPropertiesServiceOptions>) {
		this.#device = device
		this.#options = options
	}

	public async getBatteryLevel(): Promise<number | null> {
		if (this.#options.batteryReportId === null) return null
		const val = await this.#device.getFeatureReport(this.#options.batteryReportId, 3)
		return val[2] / 100
	}

	public async getBatteryCharging(): Promise<boolean | null> {
		if (this.#options.batteryReportId === null) return null
		const val = await this.#device.getFeatureReport(this.#options.batteryReportId, 3)
		return val[1] == 1
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

	public async setJogMode(mode: BlackmagicControllerJogModes): Promise<void> {
		const buffer = new Uint8Array([this.#options.jogReportId ?? 0x03, mode, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
		await this.#device.sendReports([buffer])
		return
	}
}
