import type { HIDDevice } from '../../hid-device.js'
import type {
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerControlDefinition,
	BlackmagicControllerTBarControlDefinition,
} from '../../controlDefinition.js'
import type { BlackmagicControllerLedService, BlackmagicControllerLedServiceValue } from './interface.js'
import { uint8ArrayToDataView } from '../../util.js'

export class DefaultLedService implements BlackmagicControllerLedService {
	readonly #device: HIDDevice
	// readonly #controls: readonly BlackmagicControllerControlDefinition[]

	readonly #reportId: number
	readonly #bufferSize: number

	#lastPrimaryBuffer: Uint8Array

	constructor(
		device: HIDDevice,
		_controls: readonly BlackmagicControllerControlDefinition[],
		reportId: number,
		bufferSize: number,
	) {
		this.#device = device
		// this.#controls = controls
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

	async setControlColors(values: BlackmagicControllerLedServiceValue[]): Promise<void> {
		this.#lastPrimaryBuffer = this.#createBuffer(this.#lastPrimaryBuffer)

		for (const value of values) {
			if (value.type === 'button-rgb') {
				this.#setButtonRgbValue(value.control, value.red, value.green, value.blue)
			} else if (value.type === 'button-on-off') {
				this.#setButtonOnOffValue(value.control, value.on)
			} else {
				this.#setTBarValue(value.control, value.leds)
			}
		}

		await this.#device.sendReports([this.#lastPrimaryBuffer])
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

		// TODO - this needs a rework to handle both types on the same panel
		const buttonOffset = 3 // TODO - this should be based on whether there is a tbar?

		const firstBitIndex = (control.encodedIndex - 1) * 3
		const firstByteIndex = Math.floor(firstBitIndex / 8)
		const firstBitIndexInValue = firstBitIndex % 8

		const view = uint8ArrayToDataView(this.#lastPrimaryBuffer)

		let uint16Value = view.getUint16(buttonOffset + firstByteIndex, true)
		uint16Value = maskValue(uint16Value, 1 << firstBitIndexInValue, red)
		uint16Value = maskValue(uint16Value, 1 << (firstBitIndexInValue + 1), green)
		uint16Value = maskValue(uint16Value, 1 << (firstBitIndexInValue + 2), blue)

		view.setUint16(buttonOffset + firstByteIndex, uint16Value, true)
	}

	#setButtonOnOffValue(control: BlackmagicControllerButtonControlDefinition, on: boolean): void {
		if (control.feedbackType !== 'on-off') {
			throw new TypeError(`Control ${control.encodedIndex} is not an on-off control`)
		}

		// TODO - this needs a rework to handle both types on the same panel
		const buttonOffset = 3 // TODO - this should be based on whether there is a tbar?

		const bitIndex = (control.encodedIndex - 1) * 3
		const byteIndex = Math.floor(bitIndex / 8)
		const bitIndexInValue = bitIndex % 8

		const view = uint8ArrayToDataView(this.#lastPrimaryBuffer)

		let uint8Value = view.getUint8(buttonOffset + byteIndex)
		uint8Value = maskValue(uint8Value, 1 << bitIndexInValue, on)

		view.setUint8(buttonOffset + byteIndex, uint8Value)
	}

	#setTBarValue(_control: BlackmagicControllerTBarControlDefinition, values: boolean[]) {
		let value = 0
		values.forEach((v, i) => {
			if (v) value |= 1 << i
		})

		const view = uint8ArrayToDataView(this.#lastPrimaryBuffer)
		view.setUint16(1, value, true)
	}

	async clearPanel(): Promise<void> {
		this.#lastPrimaryBuffer = this.#createBuffer(null)

		await this.#device.sendReports([this.#lastPrimaryBuffer])
		// TODO - flashing buffers?
	}
}

function maskValue(value: number, mask: number, set: boolean): number {
	if (set) {
		return value | mask
	} else {
		return value & ~mask
	}
}
