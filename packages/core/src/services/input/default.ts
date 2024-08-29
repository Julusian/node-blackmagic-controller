import type { BlackmagicPanelProperties } from '../../models/base.js'
import type { BlackmagicPanelInputService } from './interface.js'
import type { BlackmagicPanelEvents } from '../../types.js'
import type { CallbackHook } from '../callback-hook.js'
import type { BlackmagicPanelButtonControlDefinition } from '../../controlDefinition.js'

export class DefaultInputService implements BlackmagicPanelInputService {
	readonly #deviceProperties: Readonly<BlackmagicPanelProperties>
	readonly #eventSource: CallbackHook<BlackmagicPanelEvents>

	readonly #keyState = new Map<string, boolean>()

	readonly #buttonControls: Record<number, BlackmagicPanelButtonControlDefinition | undefined>

	constructor(
		deviceProperties: Readonly<BlackmagicPanelProperties>,
		eventSource: CallbackHook<BlackmagicPanelEvents>,
	) {
		this.#deviceProperties = deviceProperties
		this.#eventSource = eventSource

		this.#buttonControls = {}
		for (const control of deviceProperties.CONTROLS) {
			if (control.type !== 'button') continue
			this.#buttonControls[control.encodedIndex] = control
		}
	}

	handleInput(data: Uint8Array): void {
		console.log('input', data)
		// const dataOffset = this.#deviceProperties.KEY_DATA_OFFSET || 0
		// for (const control of this.#deviceProperties.CONTROLS) {
		// 	if (control.type !== 'button') continue
		// 	const keyPressed = Boolean(data[dataOffset + control.hidIndex])
		// 	const stateChanged = keyPressed !== this.#keyState[control.index]
		// 	if (stateChanged) {
		// 		this.#keyState[control.index] = keyPressed
		// 		if (keyPressed) {
		// 			this.#eventSource.emit('down', control)
		// 		} else {
		// 			this.#eventSource.emit('up', control)
		// 		}
		// 	}
		// }
	}
}
