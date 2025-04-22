import type { HIDDevice } from '../hid-device.js'
import type { BlackmagicControllerProperties, OpenBlackmagicControllerOptionsInternal } from './base.js'
import { BlackmagicControllerBase } from './base.js'
import { DeviceModelId } from '../id.js'
import { createOnOffButtonDefinition, freezeDefinitions } from '../controlsGenerator.js'
import type {
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerControlDefinition,
	BlackmagicControllerTBarControlDefinition,
} from '../controlDefinition.js'
import { CallbackHook } from '../services/callback-hook.js'
import type { BlackmagicControllerEvents } from '../types.js'
import { DefaultPropertiesService } from '../services/properties/default.js'
// import { DefaultInputService } from '../services/input/default.js'
import { DefaultLedService } from '../services/led/default.js'
import type { BlackmagicControllerInputService } from '../services/input/interface.js'
import { uint8ArrayToDataView } from '../util.js'

const resolveReplayEditorControls: BlackmagicControllerControlDefinition[] = [
	createOnOffButtonDefinition(0, 1, 'test1', 0x01),
	createOnOffButtonDefinition(0, 2, 'test2', 0x02),
	createOnOffButtonDefinition(0, 3, 'test3', 0x03),
	createOnOffButtonDefinition(0, 4, 'test4', 0x04),

	{
		type: 'tbar',
		id: 0,

		row: 0,
		column: 14,
		columnSpan: 1,
		rowSpan: 4,

		ledSegments: 16,
	},
]

const resolveReplayEditorProperties: BlackmagicControllerProperties = {
	MODEL: DeviceModelId.DaVinciResolveReplayEditor,
	PRODUCT_NAME: 'DaVinci Resolve Replay Editor',

	CONTROLS: freezeDefinitions(resolveReplayEditorControls),
}

export function ResolveReplayEditorFactory(
	device: HIDDevice,
	options: Required<OpenBlackmagicControllerOptionsInternal>,
): BlackmagicControllerBase {
	const events = new CallbackHook<BlackmagicControllerEvents>()

	return new BlackmagicControllerBase(device, options, {
		deviceProperties: resolveReplayEditorProperties,
		events,
		properties: new DefaultPropertiesService(device),
		inputService: new HackInputService(resolveReplayEditorProperties, events),
		led: new DefaultLedService(device, resolveReplayEditorProperties.CONTROLS),
	})
}

class HackInputService implements BlackmagicControllerInputService {
	// readonly #deviceProperties: Readonly<BlackmagicControllerProperties>
	readonly #eventSource: CallbackHook<BlackmagicControllerEvents>

	readonly #pushedButtons = new Set<string>()

	readonly #buttonControlsByEncoded: Record<number, BlackmagicControllerButtonControlDefinition | undefined>
	readonly #buttonControlsById: Record<string, BlackmagicControllerButtonControlDefinition | undefined>
	readonly #tbarControl: BlackmagicControllerTBarControlDefinition | undefined

	constructor(
		deviceProperties: Readonly<BlackmagicControllerProperties>,
		eventSource: CallbackHook<BlackmagicControllerEvents>,
	) {
		// this.#deviceProperties = deviceProperties
		this.#eventSource = eventSource

		this.#buttonControlsByEncoded = {}
		this.#buttonControlsById = {}
		for (const control of deviceProperties.CONTROLS) {
			if (control.type === 'tbar' && !this.#tbarControl) {
				this.#tbarControl = control
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
			// case 0x03:
			// 	console.log('button presses', Buffer.from(data))

			// 	this.#handleButtonInput(view)
			// 	break
			case 0x08:
				this.#handleTBarInput(view)
				break
			case 0x06:
				this.#handleBatteryLevel(view)
				break
			default:
				console.log('unknown control input', Buffer.from(data))
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

	#handleBatteryLevel(view: DataView): void {
		const value = view.getUint8(2) // TODO - test this

		this.#eventSource.emit('batteryLevel', value / 100)
	}
}
