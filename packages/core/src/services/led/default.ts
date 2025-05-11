import type { BlackmagicControllerLedService, BlackmagicControllerLedServiceValue } from './interface.js'
import { LedBuffer } from './ledBuffer.js'

export class DefaultLedService implements BlackmagicControllerLedService {
	#primaryBuffer: LedBuffer

	constructor(reportId: number, bufferSize: number) {
		this.#primaryBuffer = new LedBuffer(reportId, bufferSize)

		// TODO - flashing buffers?
	}

	setControlColors(values: BlackmagicControllerLedServiceValue[]): Uint8Array[] {
		this.#primaryBuffer.prepareNewBuffers()

		for (const value of values) {
			this.#primaryBuffer.setControlColor(value)
		}

		return this.#primaryBuffer.getBuffers()
	}

	clearPanel(): Uint8Array[] {
		this.#primaryBuffer.clearBuffers()

		return this.#primaryBuffer.getBuffers()
	}
}
