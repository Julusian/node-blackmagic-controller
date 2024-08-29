import type { HIDDevice } from '../../hid-device'
import type {
	BlackmagicPanelButtonControlDefinition,
	BlackmagicPanelControlDefinition,
	BlackmagicPanelTBarControlDefinition,
} from '../../controlDefinition'
import type { BlackmagicPanelLedService, BlackmagicPanelLedServiceValue } from './interface'
import { uint8ArrayToDataView } from '../../util'

export class DefaultLedService implements BlackmagicPanelLedService {
	readonly #device: HIDDevice
	readonly #controls: readonly BlackmagicPanelControlDefinition[]

	readonly #bufferSize: number = 32 // Future: this may need to vary

	#lastPrimaryBuffer: Uint8Array

	constructor(device: HIDDevice, controls: readonly BlackmagicPanelControlDefinition[]) {
		this.#device = device
		this.#controls = controls

		this.#lastPrimaryBuffer = this.#createBuffer(null)

		// TODO - flashing buffers?
	}

	#createBuffer(copyExisting: Uint8Array | null): Uint8Array {
		const buffer = new Uint8Array(this.#bufferSize)
		if (copyExisting) {
			buffer.set(this.#lastPrimaryBuffer)
		} else {
			buffer[0] = 0x02
		}

		return buffer
	}

	async setControlColors(values: BlackmagicPanelLedServiceValue[]): Promise<void> {
		this.#lastPrimaryBuffer = this.#createBuffer(this.#lastPrimaryBuffer)

		for (const value of values) {
			if (value.type === 'button') {
				this.#setButtonValue(value.control, value.red, value.green, value.blue)
			} else {
				this.#setTBarValue(value.control, value.leds)
			}
		}

		await this.#device.sendReports([this.#lastPrimaryBuffer])
	}

	#setButtonValue(
		control: BlackmagicPanelButtonControlDefinition,
		red: boolean,
		green: boolean,
		blue: boolean,
	): void {
		const buttonOffset = 3
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

	#setTBarValue(control: BlackmagicPanelTBarControlDefinition, values: boolean[]) {
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
