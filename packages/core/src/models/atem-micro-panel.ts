import type { HIDDevice } from '../hid-device.js'
import type { OpenBlackmagicPanelOptions, StreamDeckProperties } from './base.js'
import { BlackmagicPanelBase } from './base.js'
import { DeviceModelId } from '../id.js'
import { freezeDefinitions } from '../controlsGenerator.js'
import type { BlackmagicPanelControlDefinition } from '../controlDefinition.js'
import { CallbackHook } from '../services/callback-hook.js'
import { BlackmagicPanelEvents } from '../types.js'
import { Gen2PropertiesService } from '../services/properties/gen2.js'
import { Gen2InputService } from '../services/input/gen2.js'

const microPanelControls: BlackmagicPanelControlDefinition[] = generateButtonsGrid(4, 2, { width: 96, height: 96 })
microPanelControls.push(
	{
		type: 'button',
		row: 2,
		column: 0,
		index: 8,
		hidIndex: 8,
		feedbackType: 'rgb',
	},
	{
		type: 'button',
		row: 2,
		column: 3,
		index: 9,
		hidIndex: 9,
		feedbackType: 'rgb',
	},
)

const atemMicroPanelProperties: StreamDeckProperties = {
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
		properties: new Gen2PropertiesService(device),
		inputService: new Gen2InputService(atemMicroPanelProperties, events),
	})
}
