import type { HIDDevice } from '../hid-device.js'
import type { OpenBlackmagicPanelOptions, BlackmagicPanelProperties } from './base.js'
import { BlackmagicPanelBase } from './base.js'
import { DeviceModelId } from '../id.js'
import { freezeDefinitions } from '../controlsGenerator.js'
import type { BlackmagicPanelControlDefinition } from '../controlDefinition.js'
import { CallbackHook } from '../services/callback-hook.js'
import { BlackmagicPanelEvents } from '../types.js'
import { DefaultPropertiesService } from '../services/properties/default.js'
import { DefaultInputService } from '../services/input/default.js'
import { DefaultLedService } from '../services/led/default.js'

const microPanelControls: BlackmagicPanelControlDefinition[] = [
	{
		type: 'button',
		row: 2,
		column: 0,
		id: 'program1',
		encodedIndex: 0x0b,
		feedbackType: 'rgb',
	},
	{
		type: 'button',
		row: 2,
		column: 1,
		id: 'program2',
		encodedIndex: 0x0c,
		feedbackType: 'rgb',
	},
]

const atemMicroPanelProperties: BlackmagicPanelProperties = {
	MODEL: DeviceModelId.AtemMicroPanel,
	PRODUCT_NAME: 'Atem Micro Panel',

	CONTROLS: freezeDefinitions(microPanelControls),
}

export function AtemMicroPanelFactory(
	device: HIDDevice,
	options: Required<OpenBlackmagicPanelOptions>,
): BlackmagicPanelBase {
	const events = new CallbackHook<BlackmagicPanelEvents>()

	return new BlackmagicPanelBase(device, options, {
		deviceProperties: atemMicroPanelProperties,
		events,
		properties: new DefaultPropertiesService(device),
		inputService: new DefaultInputService(atemMicroPanelProperties, events),
		led: new DefaultLedService(device, atemMicroPanelProperties.CONTROLS),
	})
}
