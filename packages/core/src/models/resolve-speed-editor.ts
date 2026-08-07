import type { HIDDevice } from '../hid-device.js'
import type { BlackmagicControllerProperties, OpenBlackmagicControllerOptionsInternal } from './base.js'
import { BlackmagicControllerBase } from './base.js'
import { BlackmagicControllerModelId } from '../info.js'
import { createBasicButtonDefinition, freezeDefinitions } from '../controlsGenerator.js'
import type { BlackmagicControllerControlDefinition } from '../controlDefinition.js'
import { CallbackHook } from '../services/callback-hook.js'
import type { BlackmagicControllerEvents } from '../types.js'
import { DefaultPropertiesService } from '../services/properties/default.js'
import { DefaultInputService } from '../services/input/default.js'
import { LedBuffer } from '../services/led/ledBuffer.js'
import type { BlackmagicControllerLedService, BlackmagicControllerLedServiceValue } from '../services/led/interface.js'

const resolveSpeedEditorControls: BlackmagicControllerControlDefinition[] = [
	createBasicButtonDefinition(0, 0, 'smart-insert', 0x01, null),
	createBasicButtonDefinition(0, 1, 'append', 0x02, null),
	createBasicButtonDefinition(0, 2, 'ripple-owr', 0x03, null),
	createBasicButtonDefinition(0, 3, 'esc', 0x31, null),
	createBasicButtonDefinition(0, 4, 'sync-bin', 0x1f, null),
	createBasicButtonDefinition(0, 5, 'audio-level', 0x2c, null),
	createBasicButtonDefinition(0, 6, 'pull-view', 0x2d, null),
	createBasicButtonDefinition(0, 7, 'source', 0x1a, null),
	createBasicButtonDefinition(0, 9, 'timeline', 0x1b, null),

	createBasicButtonDefinition(1, 0, 'close-up', 0x04, 0x00),
	createBasicButtonDefinition(1, 1, 'place-on-top', 0x05, null),
	createBasicButtonDefinition(1, 2, 'src-owr', 0x06, null),
	createBasicButtonDefinition(1, 3, 'trans', 0x22, 0x04),
	createBasicButtonDefinition(1, 4, 'split', 0x2f, null),
	createBasicButtonDefinition(1, 5, 'snap', 0x2e, 0x05),
	createBasicButtonDefinition(1, 6, 'ripl-del', 0x2b, null),
	createBasicButtonDefinition(1, 7, 'jog-shtl', 0x1c, -2), // this negative is a hack, to differentiate them to the special command
	createBasicButtonDefinition(1, 8, 'jog-jog', 0x1d, -1), // this negative is a hack, to differentiate them to the special command
	createBasicButtonDefinition(1, 9, 'jog-scrl', 0x1e, -3), // this negative is a hack, to differentiate them to the special command

	createBasicButtonDefinition(2, 0, 'in', 0x07, null),
	createBasicButtonDefinition(2, 2, 'out', 0x08, null),
	createBasicButtonDefinition(2, 3, 'cam7', 0x39, 0x06),
	createBasicButtonDefinition(2, 4, 'cam8', 0x3a, 0x07),
	createBasicButtonDefinition(2, 5, 'cam9', 0x3b, 0x08),
	createBasicButtonDefinition(2, 6, 'live-owr', 0x30, 0x09),

	createBasicButtonDefinition(3, 0, 'trim-in', 0x09, null),
	createBasicButtonDefinition(3, 1, 'trim-out', 0x0a, null),
	createBasicButtonDefinition(3, 2, 'roll', 0x0b, null),
	createBasicButtonDefinition(3, 3, 'cam4', 0x36, 0x0a),
	createBasicButtonDefinition(3, 4, 'cam5', 0x37, 0x0b),
	createBasicButtonDefinition(3, 5, 'cam6', 0x38, 0x0c),
	createBasicButtonDefinition(3, 6, 'video-only', 0x25, 0x0d),

	createBasicButtonDefinition(4, 0, 'slip-src', 0x0c, null),
	createBasicButtonDefinition(4, 1, 'slip-dest', 0x0d, null),
	createBasicButtonDefinition(4, 2, 'trans-dur', 0x0e, null),
	createBasicButtonDefinition(4, 3, 'cam1', 0x33, 0x0e),
	createBasicButtonDefinition(4, 4, 'cam2', 0x34, 0x0f),
	createBasicButtonDefinition(4, 5, 'cam3', 0x35, 0x10),
	createBasicButtonDefinition(4, 6, 'audio-only', 0x26, 0x11),

	createBasicButtonDefinition(5, 0, 'cut', 0x0f, 0x01),
	createBasicButtonDefinition(5, 1, 'dis', 0x10, 0x02),
	createBasicButtonDefinition(5, 2, 'smth-cut', 0x11, 0x03),
	createBasicButtonDefinition(5, 3, 'stop-play', 0x3c, null),

	{
		type: 'jog',
		id: 0,
		row: 2,
		column: 7,
		columnSpan: 3,
		rowSpan: 4,
	},
]

const resolveSpeedEditorProperties: BlackmagicControllerProperties = {
	MODEL: BlackmagicControllerModelId.DaVinciResolveSpeedEditor,

	CONTROLS: freezeDefinitions(resolveSpeedEditorControls),
}

export function ResolveSpeedEditorFactory(
	device: HIDDevice,
	options: Required<OpenBlackmagicControllerOptionsInternal>,
): BlackmagicControllerBase {
	const events = new CallbackHook<BlackmagicControllerEvents>()

	return new BlackmagicControllerBase(device, options, {
		deviceProperties: resolveSpeedEditorProperties,
		events,
		properties: new DefaultPropertiesService(device, {
			batteryReportId: 0x07,
			firmwareReportId: 0x01,
			jogReportId: 0x03,
			serialReportId: 0x08,
		}),
		inputService: new DefaultInputService(resolveSpeedEditorProperties, events, {
			buttonReportId: 0x04,
			jogReportId: 0x03,
			batteryReportId: 0x07, //not used but provided for completeness
		}),
		led: new ResolveSpeedEditorLedService(device),
	})
}

class ResolveSpeedEditorLedService implements BlackmagicControllerLedService {
	readonly #device: HIDDevice

	#primaryBuffer = new LedBuffer(0x02, 5)
	#jogBuffer = new LedBuffer(0x04, 2)

	constructor(device: HIDDevice) {
		this.#device = device
	}

	async setControlColors(values: BlackmagicControllerLedServiceValue[]): Promise<void> {
		this.#primaryBuffer.prepareNewBuffers()
		this.#jogBuffer.prepareNewBuffers()

		let changedPrimary = false
		let changedJob = false

		for (const value of values) {
			if (value.type === 'button-on-off' && value.control.ledBitIndex < 0) {
				changedJob = true
				this.#jogBuffer.maskControlBits(-value.control.ledBitIndex - 1, [value.on])
			} else {
				changedPrimary = true
				this.#primaryBuffer.setControlColor(value)
			}
		}

		const result: Uint8Array[] = []
		if (changedJob) result.push(...this.#jogBuffer.getBuffers())
		if (changedPrimary) result.push(...this.#primaryBuffer.getBuffers())
		await this.#device.sendReports(result)
	}

	async clearPanel(): Promise<void> {
		this.#jogBuffer.clearBuffers()
		this.#primaryBuffer.clearBuffers()

		await this.#device.sendReports([...this.#jogBuffer.getBuffers(), ...this.#primaryBuffer.getBuffers()])
	}
}
