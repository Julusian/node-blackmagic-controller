import type { HIDDevice } from '../hid-device.js'
import type { OpenBlackmagicControllerOptionsInternal } from './base.js'
import { BlackmagicControllerBase } from './base.js'
import type { BlackmagicControllerModelDefinition } from '../modelInfo.js'
import { CallbackHook } from '../services/callback-hook.js'
import type { BlackmagicControllerEvents } from '../types.js'
import { DefaultPropertiesService } from '../services/properties/default.js'
import { DefaultInputService } from '../services/input/default.js'
import { LedBuffer } from '../services/led/ledBuffer.js'
import type { BlackmagicControllerLedService, BlackmagicControllerLedServiceValue } from '../services/led/interface.js'

export function ResolveSpeedEditorFactory(
	definition: BlackmagicControllerModelDefinition,
	device: HIDDevice,
	options: Required<OpenBlackmagicControllerOptionsInternal>,
): BlackmagicControllerBase {
	const events = new CallbackHook<BlackmagicControllerEvents>()

	return new BlackmagicControllerBase(device, options, {
		modelInfo: definition.info,
		deviceProperties: definition.properties,
		events,
		properties: new DefaultPropertiesService(device, {
			batteryReportId: null,
			firmwareReportId: 1,
			serialReportId: 8,
		}),
		inputService: new DefaultInputService(definition.properties, events, {
			buttonReportId: 0x04,
			jogReportId: 0x03,
			batteryReportId: 0x06,
		}),
		led: new ResolveShuttleLedService(device),
	})
}

class ResolveShuttleLedService implements BlackmagicControllerLedService {
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
