import type {
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerTBarControlDefinition,
} from '../../controlDefinition.js'
import { uint8ArrayToDataView } from '../../util.js'
import type { BlackmagicControllerLedServiceValue } from './interface.js'

export function maskValue(value: number, mask: number, set: boolean): number {
	if (set) {
		return value | mask
	} else {
		return value & ~mask
	}
}

export class LedBuffer {
	readonly #reportId: number
	readonly #bufferSize: number

	#lastPrimaryBuffer: Uint8Array

	constructor(reportId: number, bufferSize: number) {
		this.#reportId = reportId
		this.#bufferSize = bufferSize

		this.#lastPrimaryBuffer = this.#createBuffer(null)

		// TODO - flashing buffers?
	}

	#createBuffer(copyExisting: Uint8Array | null): Uint8Array {
		const buffer = new Uint8Array(this.#bufferSize)
		if (copyExisting) {
			buffer.set(this.#lastPrimaryBuffer)
		} else {
			buffer[0] = this.#reportId
		}

		return buffer
	}

	clearBuffers(): void {
		this.#lastPrimaryBuffer = this.#createBuffer(null)
	}

	prepareNewBuffers(): void {
		this.#lastPrimaryBuffer = this.#createBuffer(this.#lastPrimaryBuffer)
	}

	setControlColor(value: BlackmagicControllerLedServiceValue): void {
		if (value.type === 'button-rgb') {
			this.#setButtonRgbValue(value.control, value.red, value.green, value.blue)
		} else if (value.type === 'button-on-off') {
			this.#setButtonOnOffValue(value.control, value.on)
		} else {
			this.#setTBarValue(value.control, value.leds)
		}
	}

	maskControlBits(startIndex: number, values: Array<boolean | undefined>): void {
		const view = uint8ArrayToDataView(this.#lastPrimaryBuffer)

		for (let i = 0; i < values.length; i++) {
			// Note: This is not particularly efficient, but it isn't done that often
			const byteIndex = Math.floor((startIndex + i) / 8)
			const bitIndexInValue = (startIndex + i) % 8

			let uint8Value = view.getUint8(1 + byteIndex)
			uint8Value = maskValue(uint8Value, 1 << bitIndexInValue, !!values[i])

			view.setUint8(1 + byteIndex, uint8Value)
		}
	}

	getBuffers(): Uint8Array[] {
		return [this.#lastPrimaryBuffer]
	}

	#setButtonRgbValue(
		control: BlackmagicControllerButtonControlDefinition,
		red: boolean,
		green: boolean,
		blue: boolean,
	): void {
		if (control.feedbackType !== 'rgb') {
			throw new TypeError(`Control ${control.encodedIndex} is not a rgb control`)
		}

		this.maskControlBits(control.ledBitIndex, [red, green, blue])
	}

	#setButtonOnOffValue(control: BlackmagicControllerButtonControlDefinition, on: boolean): void {
		if (control.feedbackType !== 'on-off') {
			throw new TypeError(`Control ${control.encodedIndex} is not an on-off control`)
		}

		if (control.ledBitIndex < 0) return

		this.maskControlBits(control.ledBitIndex, [on])
	}

	#setTBarValue(control: BlackmagicControllerTBarControlDefinition, values: boolean[]) {
		const valuesClamped = [...values]
		values.length = control.ledSegments

		this.maskControlBits(control.ledBitIndex, valuesClamped)
	}
}
