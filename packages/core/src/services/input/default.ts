import type { BlackmagicControllerProperties } from '../../models/base.js'
import type { BlackmagicControllerInputService } from './interface.js'
import type { BlackmagicControllerEvents } from '../../types.js'
import type { CallbackHook } from '../callback-hook.js'
import type {
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerJogControlDefinition,
	BlackmagicControllerTBarControlDefinition,
} from '../../controlDefinition.js'
import { uint8ArrayToDataView } from '../../util.js'

export interface DefaultInputServiceOptions {
	buttonReportId: number
	tbarReportId?: number
	jogReportId?: number
	batteryReportId: number
}

export class DefaultInputService implements BlackmagicControllerInputService {
	// readonly #deviceProperties: Readonly<BlackmagicControllerProperties>
	readonly #eventSource: CallbackHook<BlackmagicControllerEvents>
	readonly #options: Readonly<DefaultInputServiceOptions>

	readonly #pushedButtons = new Set<string>()

	readonly #buttonControlsByEncoded: Record<number, BlackmagicControllerButtonControlDefinition | undefined>
	readonly #buttonControlsById: Record<string, BlackmagicControllerButtonControlDefinition | undefined>
	readonly #tbarControl: BlackmagicControllerTBarControlDefinition | undefined
	readonly #jogControl: BlackmagicControllerJogControlDefinition | undefined

	constructor(
		deviceProperties: Readonly<BlackmagicControllerProperties>,
		eventSource: CallbackHook<BlackmagicControllerEvents>,
		options: Readonly<DefaultInputServiceOptions>,
	) {
		// this.#deviceProperties = deviceProperties
		this.#eventSource = eventSource
		this.#options = options

		this.#buttonControlsByEncoded = {}
		this.#buttonControlsById = {}
		for (const control of deviceProperties.CONTROLS) {
			if (control.type === 'tbar' && !this.#tbarControl) {
				this.#tbarControl = control
			}
			if (control.type === 'jog' && !this.#jogControl) {
				this.#jogControl = control
			}
			if (control.type === 'button') {
				this.#buttonControlsByEncoded[control.encodedIndex] = control
				this.#buttonControlsById[control.id] = control
			}
		}
	}

	handleInput(data: Uint8Array): void {
		const view = uint8ArrayToDataView(data)

		switch (view.getUint8(0)) {
			case this.#options.buttonReportId:
				console.log('button presses', Buffer.from(data))
				this.#handleButtonInput(view)
				break
			case this.#options.tbarReportId:
				this.#handleTBarInput(view)
				break
			case this.#options.jogReportId:
				this.#handleJogInput(view)
				break
			case this.#options.batteryReportId:
				this.#handleBatteryLevel(view)
				break
		}
	}

	#handleButtonInput(view: DataView): void {
		const pushedControls: BlackmagicControllerButtonControlDefinition[] = []
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

	#handleTBarInput(view: DataView): void {
		if (!this.#tbarControl) return
		const value = view.getUint16(1, true)

		this.#eventSource.emit('tbar', this.#tbarControl, value / 4096)
	}

	#handleJogInput(view: DataView): void {
		if (!this.#jogControl) return
		const value = view.getInt32(2, true)

		this.#eventSource.emit('jog', this.#jogControl, value) // TODO - some scaling
	}

	#handleBatteryLevel(view: DataView): void {
		const value = view.getUint8(2) // TODO - test this

		this.#eventSource.emit('batteryLevel', value / 100)
	}
}
