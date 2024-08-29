import type { BlackmagicPanelProperties } from '../../models/base.js'
import type { BlackmagicPanelInputService } from './interface.js'
import type { BlackmagicPanelEvents } from '../../types.js'
import type { CallbackHook } from '../callback-hook.js'
import type { BlackmagicPanelButtonControlDefinition } from '../../controlDefinition.js'
import { uint8ArrayToDataView } from '../../util.js'

export class DefaultInputService implements BlackmagicPanelInputService {
	// readonly #deviceProperties: Readonly<BlackmagicPanelProperties>
	readonly #eventSource: CallbackHook<BlackmagicPanelEvents>

	readonly #pushedButtons = new Set<string>()

	readonly #buttonControlsByEncoded: Record<number, BlackmagicPanelButtonControlDefinition | undefined>
	readonly #buttonControlsById: Record<string, BlackmagicPanelButtonControlDefinition | undefined>

	constructor(
		deviceProperties: Readonly<BlackmagicPanelProperties>,
		eventSource: CallbackHook<BlackmagicPanelEvents>,
	) {
		// this.#deviceProperties = deviceProperties
		this.#eventSource = eventSource

		this.#buttonControlsByEncoded = {}
		this.#buttonControlsById = {}
		for (const control of deviceProperties.CONTROLS) {
			if (control.type !== 'button') continue
			this.#buttonControlsByEncoded[control.encodedIndex] = control
			this.#buttonControlsById[control.id] = control
		}
	}

	handleInput(data: Uint8Array): void {
		const view = uint8ArrayToDataView(data)

		switch (view.getUint8(0)) {
			case 0x03:
				this.#handleButtonInput(view)
				break
			// TODO - tbar

			// TODO - battery
		}
	}

	#handleButtonInput(view: DataView): void {
		const pushedControls: BlackmagicPanelButtonControlDefinition[] = []
		const pushedControlIds = new Set<string>()

		for (let i = 1; i < view.byteLength; i += 2) {
			const value = view.getUint16(i, true)
			if (value === 0) break

			const control = this.#buttonControlsByEncoded[value]
			if (!control) continue

			pushedControlIds.add(control.id)
			pushedControls.push(control)
		}

		// Check for key ups
		for (const keyId of this.#pushedButtons) {
			// Check if still pressed
			if (pushedControlIds.has(keyId)) continue

			const control = this.#buttonControlsById[keyId]
			if (control) this.#eventSource.emit('up', control)

			this.#pushedButtons.delete(keyId)
		}

		for (const control of pushedControls) {
			// Check if already pressed
			if (this.#pushedButtons.has(control.id)) continue

			this.#pushedButtons.add(control.id)
			this.#eventSource.emit('down', control)
		}
	}
}
