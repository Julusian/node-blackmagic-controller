import type { HIDDevice } from '../../hid-device'
import type { BlackmagicPanelButtonControlDefinition, BlackmagicPanelControlDefinition } from '../../controlDefinition'
import type { BlackmagicPanelLedService } from './interface'

export class DefaultLedService implements BlackmagicPanelLedService {
	readonly #device: HIDDevice
	readonly #controls: readonly BlackmagicPanelControlDefinition[]

	readonly #bufferSize: number = 32 // Future: this may need to vary

	#lastPrimaryBuffer: Uint8Array

	constructor(device: HIDDevice, controls: readonly BlackmagicPanelControlDefinition[]) {
		this.#device = device
		this.#controls = controls

		this.#lastPrimaryBuffer = new Uint8Array(this.#bufferSize)
		this.#lastPrimaryBuffer[0] = 0x02

		// TODO - flashing buffers?
	}

	// nocommit - set tbar

	async setButtonColor(
		control: BlackmagicPanelButtonControlDefinition,
		r: boolean,
		g: boolean,
		b: boolean,
	): Promise<void> {
		// TODO
	}

	async clearPanel(): Promise<void> {
		this.#lastPrimaryBuffer = new Uint8Array(this.#bufferSize)

		await this.#device.sendReports([this.#lastPrimaryBuffer])
		// TODO - flashing buffers?
	}
}
