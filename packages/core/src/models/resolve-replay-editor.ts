import type { HIDDevice } from '../hid-device.js'
import type { BlackmagicControllerProperties, OpenBlackmagicControllerOptionsInternal } from './base.js'
import { BlackmagicControllerBase } from './base.js'
import { DeviceModelId } from '../id.js'
import { createBasicButtonDefinition, freezeDefinitions } from '../controlsGenerator.js'
import type {
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerControlDefinition,
	BlackmagicControllerJogControlDefinition,
	BlackmagicControllerTBarControlDefinition,
} from '../controlDefinition.js'
import { CallbackHook } from '../services/callback-hook.js'
import type { BlackmagicControllerEvents } from '../types.js'
// import { DefaultPropertiesService } from '../services/properties/default.js'
// import { DefaultInputService } from '../services/input/default.js'
import { DefaultLedService } from '../services/led/default.js'
import type { BlackmagicControllerInputService } from '../services/input/interface.js'
import { uint8ArrayToDataView } from '../util.js'
import type { PropertiesService } from '../services/properties/interface.js'

const resolveReplayEditorControls: BlackmagicControllerControlDefinition[] = [
	createBasicButtonDefinition(0, 0, 'undo', 0x65, false),
	createBasicButtonDefinition(0, 1, 'new-tline', 0x3e, false),
	createBasicButtonDefinition(0, 6, 'cue', 0x3f, true),
	createBasicButtonDefinition(0, 7, 'run', 0x40, true),
	createBasicButtonDefinition(0, 8, 'dump', 0x41, true),
	createBasicButtonDefinition(0, 10, 'go-to-end', 0x6b, false),
	createBasicButtonDefinition(0, 11, 'input-view', 0x42, true),
	createBasicButtonDefinition(0, 12, 'multi-src', 0x43, true),
	createBasicButtonDefinition(0, 14, 'single-clip', 0x44, true),
	createBasicButtonDefinition(1, 1, 'trim-all', 0x3d, false),
	createBasicButtonDefinition(1, 3, 'ripl-del', 0x2b, false),
	createBasicButtonDefinition(1, 4, 'video-only', 0x25, true),
	createBasicButtonDefinition(1, 5, 'auto-sting', 0x45, true),
	createBasicButtonDefinition(1, 6, 'ramp-down', 0x46, false),
	createBasicButtonDefinition(1, 7, 'speed-pos', 0x47, true),
	createBasicButtonDefinition(1, 9, 'sync-bin', 0x1f, false),
	createBasicButtonDefinition(1, 10, 'add-mark', 0x68, false),
	createBasicButtonDefinition(1, 11, 'full-view', 0x2d, true),
	createBasicButtonDefinition(2, 4, 'audio-only', 0x26, true),
	createBasicButtonDefinition(2, 5, 'sel-sting', 0x48, true),
	createBasicButtonDefinition(2, 6, 'slow', 0x49, false),
	createBasicButtonDefinition(2, 7, 'set-speed', 0x4a, true),
	createBasicButtonDefinition(2, 9, 'split', 0x2f, false),
	createBasicButtonDefinition(2, 10, 'snap', 0x2e, true),
	createBasicButtonDefinition(2, 11, 'mv-view', 0x4b, true),
	createBasicButtonDefinition(2, 12, 'source', 0x1a, false),
	createBasicButtonDefinition(2, 14, 'timeline', 0x1b, false),
	createBasicButtonDefinition(3, 0, 'live-speed', 0x63, true),
	createBasicButtonDefinition(3, 1, 'smart-insert', 0x01, false),
	createBasicButtonDefinition(3, 2, 'appnd', 0x02, false),
	createBasicButtonDefinition(3, 3, 'ripl-owr', 0x03, false),
	createBasicButtonDefinition(4, 1, 'close-up', 0x04, true),
	createBasicButtonDefinition(4, 2, 'place-on-top', 0x05, false),
	createBasicButtonDefinition(4, 3, 'src-owr', 0x06, false),
	createBasicButtonDefinition(4, 4, 'set-poi', 0x4d, true),
	createBasicButtonDefinition(4, 5, 'go-to-poi', 0x4c, false),
	createBasicButtonDefinition(4, 6, '2sec', 0x5d, true),
	createBasicButtonDefinition(4, 7, '3sec', 0x5e, true),
	createBasicButtonDefinition(4, 8, '4sec', 0x5f, true),
	createBasicButtonDefinition(4, 9, '5sec', 0x60, true),
	createBasicButtonDefinition(4, 10, '6sec', 0x61, true),
	createBasicButtonDefinition(4, 11, '7sec', 0x62, true),
	createBasicButtonDefinition(4, 12, 'slow', 0x69, true),
	createBasicButtonDefinition(4, 13, 'jog', 0x1d, true),
	createBasicButtonDefinition(4, 14, 'scrl', 0x1e, true),
	createBasicButtonDefinition(5, 1, 'in', 0x07, false),
	createBasicButtonDefinition(5, 3, 'out', 0x08, false),
	createBasicButtonDefinition(5, 4, 'all-cams', 0x64, true),
	createBasicButtonDefinition(5, 5, 'cams-9-16', 0x5c, true),
	createBasicButtonDefinition(5, 6, 'title1', 0x4e, true),
	createBasicButtonDefinition(5, 7, 'title2', 0x4f, true),
	createBasicButtonDefinition(5, 8, 'title3', 0x50, true),
	createBasicButtonDefinition(5, 9, 'title4', 0x51, true),
	createBasicButtonDefinition(5, 10, 'title5', 0x52, true),
	createBasicButtonDefinition(5, 11, 'title6', 0x53, true),
	createBasicButtonDefinition(6, 1, 'trim-in', 0x09, false),
	createBasicButtonDefinition(6, 2, 'trim-out', 0x0a, false),
	createBasicButtonDefinition(6, 3, 'roll', 0x0b, false),
	createBasicButtonDefinition(7, 1, 'slip', 0x67, false),
	createBasicButtonDefinition(7, 2, 'slide', 0x66, false),
	createBasicButtonDefinition(7, 3, 'trans-dur', 0x0e, false),
	createBasicButtonDefinition(7, 4, 'cam1', 0x54, true),
	createBasicButtonDefinition(7, 5, 'cam2', 0x55, true),
	createBasicButtonDefinition(7, 6, 'cam3', 0x56, true),
	createBasicButtonDefinition(7, 7, 'cam4', 0x57, true),
	createBasicButtonDefinition(7, 8, 'cam5', 0x58, true),
	createBasicButtonDefinition(7, 9, 'cam6', 0x59, true),
	createBasicButtonDefinition(7, 10, 'cam7', 0x5a, true),
	createBasicButtonDefinition(7, 11, 'cam8', 0x5b, true),
	createBasicButtonDefinition(8, 1, 'cut', 0x0f, true),
	createBasicButtonDefinition(8, 2, 'dis', 0x10, true),
	createBasicButtonDefinition(8, 3, 'trans', 0x22, true),
	createBasicButtonDefinition(8, 4, 'stop-play', 0x3c, false),

	{
		type: 'tbar',
		id: 0,

		row: 0,
		column: 14,
		columnSpan: 1,
		rowSpan: 4,

		ledSegments: 16,
	},
	{
		type: 'jog',
		id: 0,
		row: 0,
		column: 14,
		columnSpan: 1,
		rowSpan: 4,
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
		properties: new ReplayEditorPropertiesService(device),
		inputService: new HackInputService(resolveReplayEditorProperties, events),
		led: new DefaultLedService(device, resolveReplayEditorProperties.CONTROLS, 0x09, 33),
	})
}

class HackInputService implements BlackmagicControllerInputService {
	// readonly #deviceProperties: Readonly<BlackmagicControllerProperties>
	readonly #eventSource: CallbackHook<BlackmagicControllerEvents>

	readonly #pushedButtons = new Set<string>()

	readonly #buttonControlsByEncoded: Record<number, BlackmagicControllerButtonControlDefinition | undefined>
	readonly #buttonControlsById: Record<string, BlackmagicControllerButtonControlDefinition | undefined>
	readonly #tbarControl: BlackmagicControllerTBarControlDefinition | undefined
	readonly #jogControl: BlackmagicControllerJogControlDefinition | undefined

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
			case 0x04:
				console.log('button presses', Buffer.from(data))

				this.#handleButtonInput(view)
				break
			case 0x0a:
				this.#handleTBarInput(view)
				break
			case 0x03:
				this.#handleJogInput(view)
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

class ReplayEditorPropertiesService implements PropertiesService {
	readonly #device: HIDDevice

	constructor(device: HIDDevice) {
		this.#device = device
	}

	public async getBatteryLevel(): Promise<number | null> {
		const val = await this.#device.getFeatureReport(7, 3)
		return val[2] / 100
	}

	public async getFirmwareVersion(): Promise<string> {
		const val = await this.#device.getFeatureReport(1, 9)
		const view = uint8ArrayToDataView(val)

		// Generate a semver format string
		return `${view.getUint8(5)}.${view.getUint8(6)}.${view.getUint8(7)}+${view.getUint32(1, true).toString(16)}`
	}

	public async getSerialNumber(): Promise<string> {
		const val = await this.#device.getFeatureReport(8, 33)
		return new TextDecoder('ascii').decode(val.subarray(1))
	}
}
