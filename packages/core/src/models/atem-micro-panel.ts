import type { HIDDevice } from '../hid-device.js'
import type { OpenBlackmagicControllerOptionsInternal } from './base.js'
import { BlackmagicControllerBase } from './base.js'
import type { BlackmagicControllerModelDefinition } from '../modelInfo.js'
import { CallbackHook } from '../services/callback-hook.js'
import type { BlackmagicControllerEvents } from '../types.js'
import { DefaultPropertiesService } from '../services/properties/default.js'
import { DefaultInputService } from '../services/input/default.js'
import { DefaultLedService } from '../services/led/default.js'

export function AtemMicroPanelFactory(
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
			batteryReportId: 6,
			firmwareReportId: 1,
			serialReportId: 7,
		}),
		inputService: new DefaultInputService(definition.properties, events, {
			buttonReportId: 0x03,
			tbarReportId: 0x08,
			batteryReportId: 0x06,
		}),
		led: new DefaultLedService(device, 0x02, 32),
	})
}
