import type { HIDDevice } from '../hid-device.js'
import type { BlackmagicControllerProperties, OpenBlackmagicControllerOptionsInternal } from './base.js'
import { BlackmagicControllerBase } from './base.js'
import { DeviceModelId } from '../id.js'
import { createRgbButtonDefinition, freezeDefinitions } from '../controlsGenerator.js'
import type { BlackmagicControllerControlDefinition } from '../controlDefinition.js'
import { CallbackHook } from '../services/callback-hook.js'
import type { BlackmagicControllerEvents } from '../types.js'
import { DefaultPropertiesService } from '../services/properties/default.js'
import { DefaultInputService } from '../services/input/default.js'
import { DefaultLedService } from '../services/led/default.js'

const microPanelControls: BlackmagicControllerControlDefinition[] = [
	createRgbButtonDefinition(0, 5, 'macro', 0x01, 16),

	createRgbButtonDefinition(0, 6, 'key1-on', 0x02, 19),
	createRgbButtonDefinition(0, 7, 'key2-on', 0x03, 22),
	createRgbButtonDefinition(0, 8, 'key3-on', 0x04, 25),
	createRgbButtonDefinition(0, 9, 'key4-on', 0x05, 28),

	createRgbButtonDefinition(1, 5, 'next-background', 0x06, 31),
	createRgbButtonDefinition(1, 6, 'next-key1', 0x07, 34),
	createRgbButtonDefinition(1, 7, 'next-key2', 0x08, 37),
	createRgbButtonDefinition(1, 8, 'next-key3', 0x09, 40),
	createRgbButtonDefinition(1, 9, 'next-key4', 0x0a, 43),

	createRgbButtonDefinition(2, 0, 'program1', 0x0b, 46),
	createRgbButtonDefinition(2, 1, 'program2', 0x0c, 49),
	createRgbButtonDefinition(2, 2, 'program3', 0x0d, 52),
	createRgbButtonDefinition(2, 3, 'program4', 0x0e, 55),
	createRgbButtonDefinition(2, 4, 'program5', 0x0f, 58),
	createRgbButtonDefinition(2, 5, 'program6', 0x10, 61),
	createRgbButtonDefinition(2, 6, 'program7', 0x11, 64),
	createRgbButtonDefinition(2, 7, 'program8', 0x12, 67),
	createRgbButtonDefinition(2, 8, 'program9', 0x13, 70),
	createRgbButtonDefinition(2, 9, 'program10', 0x14, 73),

	createRgbButtonDefinition(3, 0, 'preview1', 0x15, 76),
	createRgbButtonDefinition(3, 1, 'preview2', 0x16, 79),
	createRgbButtonDefinition(3, 2, 'preview3', 0x17, 82),
	createRgbButtonDefinition(3, 3, 'preview4', 0x18, 85),
	createRgbButtonDefinition(3, 4, 'preview5', 0x19, 88),
	createRgbButtonDefinition(3, 5, 'preview6', 0x1a, 91),
	createRgbButtonDefinition(3, 6, 'preview7', 0x1b, 94),
	createRgbButtonDefinition(3, 7, 'preview8', 0x1c, 97),
	createRgbButtonDefinition(3, 8, 'preview9', 0x1d, 100),
	createRgbButtonDefinition(3, 9, 'preview10', 0x1e, 103),

	createRgbButtonDefinition(0, 10, 'mixeffect1', 0x1f, 106),
	createRgbButtonDefinition(0, 11, 'mixeffect2', 0x20, 109),
	createRgbButtonDefinition(0, 12, 'mixeffect3', 0x21, 112),
	createRgbButtonDefinition(0, 13, 'mixeffect4', 0x22, 115),

	createRgbButtonDefinition(1, 11, 'transition-dip', 0x23, 118),
	createRgbButtonDefinition(1, 12, 'transition-dve', 0x24, 121),
	createRgbButtonDefinition(1, 13, 'transition-sting', 0x25, 124),

	createRgbButtonDefinition(2, 11, 'transition-mix', 0x27, 130),
	createRgbButtonDefinition(2, 12, 'transition-wipe', 0x28, 133),
	createRgbButtonDefinition(2, 13, 'transition-arm', 0x29, 136),

	createRgbButtonDefinition(2, 10, 'shift', 0x26, 127),

	createRgbButtonDefinition(3, 10, 'preview-transition', 0x2a, 139),

	createRgbButtonDefinition(3, 11, 'cut', 0x2b, 142),
	createRgbButtonDefinition(3, 13, 'auto', 0x2c, 145),

	{
		type: 'tbar',
		id: 0,

		row: 0,
		column: 14,
		columnSpan: 1,
		rowSpan: 4,

		ledSegments: 16,
		ledBitIndex: 0,
	},

	createRgbButtonDefinition(1, 15, 'dsk1-tie', 0x2d, 148),
	createRgbButtonDefinition(1, 16, 'dsk2-tie', 0x2e, 151),
	createRgbButtonDefinition(2, 15, 'dsk1-cut', 0x2f, 154),
	createRgbButtonDefinition(2, 16, 'dsk2-cut', 0x30, 157),
	createRgbButtonDefinition(3, 15, 'dsk1-auto', 0x31, 160),
	createRgbButtonDefinition(3, 16, 'dsk2-auto', 0x32, 163),
]

const atemMicroPanelProperties: BlackmagicControllerProperties = {
	MODEL: DeviceModelId.AtemMicroPanel,
	PRODUCT_NAME: 'Atem Micro Panel',

	CONTROLS: freezeDefinitions(microPanelControls),
}

export function AtemMicroPanelFactory(
	device: HIDDevice,
	options: Required<OpenBlackmagicControllerOptionsInternal>,
): BlackmagicControllerBase {
	const events = new CallbackHook<BlackmagicControllerEvents>()

	return new BlackmagicControllerBase(device, options, {
		deviceProperties: atemMicroPanelProperties,
		events,
		properties: new DefaultPropertiesService(device, {
			batteryReportId: 6,
			firmwareReportId: 1,
			serialReportId: 7,
		}),
		inputService: new DefaultInputService(atemMicroPanelProperties, events, {
			buttonReportId: 0x03,
			tbarReportId: 0x08,
			batteryReportId: 0x06,
		}),
		led: new DefaultLedService(device, 0x02, 32),
	})
}
