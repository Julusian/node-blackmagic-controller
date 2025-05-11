import type { HIDDevice } from '../../hid-device.js'
import type { BlackmagicControllerLedService, BlackmagicControllerLedServiceValue } from './interface.js'
import { LedBuffer } from './ledBuffer.js'

export class DefaultLedService implements BlackmagicControllerLedService {
	readonly #device: HIDDevice

	#primaryBuffer: LedBuffer

	constructor(device: HIDDevice, reportId: number, bufferSize: number) {
		this.#device = device

		this.#primaryBuffer = new LedBuffer(reportId, bufferSize)

		// TODO - flashing buffers?
	}

	async setControlColors(values: BlackmagicControllerLedServiceValue[]): Promise<void> {
		this.#primaryBuffer.prepareNewBuffers()

		for (const value of values) {
			this.#primaryBuffer.setControlColor(value)
		}

		await this.#device.sendReports(this.#primaryBuffer.getBuffers())
	}

	async clearPanel(): Promise<void> {
		this.#primaryBuffer.clearBuffers()

		await this.#device.sendReports(this.#primaryBuffer.getBuffers())
	}
}
