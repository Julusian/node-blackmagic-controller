import type { HIDDevice } from '../hid-device.js'
import type { BlackmagicControllerProperties, OpenBlackmagicControllerOptionsInternal } from './base.js'
import { BlackmagicControllerBase } from './base.js'
import { DeviceModelId } from '../id.js'
import { createBasicButtonDefinition, freezeDefinitions } from '../controlsGenerator.js'
import type { BlackmagicControllerControlDefinition } from '../controlDefinition.js'
import { CallbackHook } from '../services/callback-hook.js'
import type { BlackmagicControllerEvents } from '../types.js'
import { DefaultPropertiesService } from '../services/properties/default.js'
import { DefaultInputService } from '../services/input/default.js'
import { LedBuffer } from '../services/led/ledBuffer.js'
import type { BlackmagicControllerLedService, BlackmagicControllerLedServiceValue } from '../services/led/interface.js'

const resolveReplayEditorControls: BlackmagicControllerControlDefinition[] = [
	createBasicButtonDefinition(0, 0, 'undo', 0x65, null),
	createBasicButtonDefinition(0, 1, 'new-tline', 0x3e, null),
	createBasicButtonDefinition(0, 6, 'cue', 0x3f, 0),
	createBasicButtonDefinition(0, 7, 'run', 0x40, 1),
	createBasicButtonDefinition(0, 8, 'dump', 0x41, 2),
	createBasicButtonDefinition(0, 10, 'go-to-end', 0x6b, null),
	createBasicButtonDefinition(0, 11, 'input-view', 0x42, 3),
	createBasicButtonDefinition(0, 12, 'multi-src', 0x43, 4),
	createBasicButtonDefinition(0, 14, 'single-clip', 0x44, 5),
	createBasicButtonDefinition(1, 1, 'trim-all', 0x3d, null),
	createBasicButtonDefinition(1, 3, 'ripl-del', 0x2b, null),
	createBasicButtonDefinition(1, 4, 'video-only', 0x25, 6),
	createBasicButtonDefinition(1, 5, 'auto-sting', 0x45, 7),
	createBasicButtonDefinition(1, 6, 'ramp-down', 0x46, null),
	createBasicButtonDefinition(1, 7, 'speed-pos', 0x47, 8),
	createBasicButtonDefinition(1, 9, 'sync-bin', 0x1f, null),
	createBasicButtonDefinition(1, 10, 'add-mark', 0x68, null),
	createBasicButtonDefinition(1, 11, 'full-view', 0x2d, 9),
	createBasicButtonDefinition(2, 4, 'audio-only', 0x26, 10),
	createBasicButtonDefinition(2, 5, 'sel-sting', 0x48, 11),
	createBasicButtonDefinition(2, 6, 'slow', 0x49, null),
	createBasicButtonDefinition(2, 7, 'set-speed', 0x4a, 12),
	createBasicButtonDefinition(2, 9, 'split', 0x2f, null),
	createBasicButtonDefinition(2, 10, 'snap', 0x2e, 13),
	createBasicButtonDefinition(2, 11, 'mv-view', 0x4b, 14),
	createBasicButtonDefinition(2, 12, 'source', 0x1a, null),
	createBasicButtonDefinition(2, 14, 'timeline', 0x1b, null),
	createBasicButtonDefinition(3, 0, 'live-speed', 0x63, 15),
	createBasicButtonDefinition(3, 1, 'smart-insert', 0x01, null),
	createBasicButtonDefinition(3, 2, 'appnd', 0x02, null),
	createBasicButtonDefinition(3, 3, 'ripl-owr', 0x03, null),
	createBasicButtonDefinition(4, 1, 'close-up', 0x04, 16),
	createBasicButtonDefinition(4, 2, 'place-on-top', 0x05, null),
	createBasicButtonDefinition(4, 3, 'src-owr', 0x06, null),
	createBasicButtonDefinition(4, 4, 'set-poi', 0x4d, 17),
	createBasicButtonDefinition(4, 5, 'go-to-poi', 0x4c, null),
	createBasicButtonDefinition(4, 6, '2sec', 0x5d, 18),
	createBasicButtonDefinition(4, 7, '3sec', 0x5e, 19),
	createBasicButtonDefinition(4, 8, '4sec', 0x5f, 20),
	createBasicButtonDefinition(4, 9, '5sec', 0x60, 21),
	createBasicButtonDefinition(4, 10, '6sec', 0x61, 22),
	createBasicButtonDefinition(4, 11, '7sec', 0x62, 23),
	createBasicButtonDefinition(4, 12, 'slow-jog', 0x69, -4), // this negative is a hack, to differentiate them to the special command
	createBasicButtonDefinition(4, 13, 'jog-jog', 0x1d, -1), // this negative is a hack, to differentiate them to the special command
	createBasicButtonDefinition(4, 14, 'scrl-jog', 0x1e, -3), // this negative is a hack, to differentiate them to the special command
	createBasicButtonDefinition(5, 1, 'in', 0x07, null),
	createBasicButtonDefinition(5, 3, 'out', 0x08, null),
	createBasicButtonDefinition(5, 4, 'all-cams', 0x64, 24),
	createBasicButtonDefinition(5, 5, 'cams-9-16', 0x5c, 25),
	createBasicButtonDefinition(5, 6, 'title1', 0x4e, 26),
	createBasicButtonDefinition(5, 7, 'title2', 0x4f, 27),
	createBasicButtonDefinition(5, 8, 'title3', 0x50, 28),
	createBasicButtonDefinition(5, 9, 'title4', 0x51, 29),
	createBasicButtonDefinition(5, 10, 'title5', 0x52, 30),
	createBasicButtonDefinition(5, 11, 'title6', 0x53, 31),
	createBasicButtonDefinition(6, 1, 'trim-in', 0x09, null),
	createBasicButtonDefinition(6, 2, 'trim-out', 0x0a, null),
	createBasicButtonDefinition(6, 3, 'roll', 0x0b, null),
	createBasicButtonDefinition(7, 1, 'slip', 0x67, null),
	createBasicButtonDefinition(7, 2, 'slide', 0x66, null),
	createBasicButtonDefinition(7, 3, 'trans-dur', 0x0e, null),
	createBasicButtonDefinition(7, 4, 'cam1', 0x54, 32),
	createBasicButtonDefinition(7, 5, 'cam2', 0x55, 33),
	createBasicButtonDefinition(7, 6, 'cam3', 0x56, 34),
	createBasicButtonDefinition(7, 7, 'cam4', 0x57, 35),
	createBasicButtonDefinition(7, 8, 'cam5', 0x58, 36),
	createBasicButtonDefinition(7, 9, 'cam6', 0x59, 37),
	createBasicButtonDefinition(7, 10, 'cam7', 0x5a, 38),
	createBasicButtonDefinition(7, 11, 'cam8', 0x5b, 39),
	createBasicButtonDefinition(8, 1, 'cut', 0x0f, 40),
	createBasicButtonDefinition(8, 2, 'dis', 0x10, 41),
	createBasicButtonDefinition(8, 3, 'trans', 0x22, 42),
	createBasicButtonDefinition(8, 4, 'stop-play', 0x3c, null),

	{
		type: 'tbar',
		id: 0,

		row: 4,
		column: 0,
		columnSpan: 1,
		rowSpan: 5,

		ledSegments: 16,
		ledBitIndex: 43,
	},
	{
		type: 'jog',
		id: 0,
		row: 5,
		column: 12,
		columnSpan: 3,
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
		properties: new DefaultPropertiesService(device, {
			batteryReportId: 7,
			firmwareReportId: 1, // TODO - check the number of this
			serialReportId: 8,
		}),
		inputService: new DefaultInputService(resolveReplayEditorProperties, events, {
			buttonReportId: 0x04,
			tbarReportId: 0x0a,
			jogReportId: 0x03,
			batteryReportId: 0x06,
		}),
		led: new ResolveReplayLedService(device),
	})
}

class ResolveReplayLedService implements BlackmagicControllerLedService {
	readonly #device: HIDDevice

	#primaryBuffer = new LedBuffer(0x09, 33)
	#jobBuffer = new LedBuffer(0x04, 2)

	constructor(device: HIDDevice) {
		this.#device = device
	}

	async setControlColors(values: BlackmagicControllerLedServiceValue[]): Promise<void> {
		this.#primaryBuffer.prepareNewBuffers()
		this.#jobBuffer.prepareNewBuffers()

		let changedPrimary = false
		let changedJob = false

		for (const value of values) {
			if (value.type === 'button-on-off' && value.control.ledBitIndex < 0) {
				changedJob = true
				this.#jobBuffer.maskControlBits(-value.control.ledBitIndex - 1, [value.on])
			} else {
				changedPrimary = true
				this.#primaryBuffer.setControlColor(value)
			}
		}

		const result: Uint8Array[] = []
		if (changedJob) result.push(...this.#jobBuffer.getBuffers())
		if (changedPrimary) result.push(...this.#primaryBuffer.getBuffers())
		await this.#device.sendReports(result)
	}

	async clearPanel(): Promise<void> {
		this.#jobBuffer.clearBuffers()
		this.#primaryBuffer.clearBuffers()

		await this.#device.sendReports([...this.#jobBuffer.getBuffers(), ...this.#primaryBuffer.getBuffers()])
	}
}
