import type { BlackmagicControllerControlBounds } from '../controlDefinition.js'
import { createBasicButtonDefinition, createRgbButtonDefinition, freezeDefinitions } from '../controlsGenerator.js'
import type { BlackmagicControllerStaticProperties } from './base.js'

/**
 * The static properties of each model.
 *
 * Note: this module must not import anything which pulls in the services used to drive a device,
 * so that `DEVICE_MODEL_INFO` can be consumed without them.
 *
 * The `faceSize` of each model is its published width and depth, in millimetres.
 * The `bounds` of every control are approximate, as none are from a dimensioned drawing. They are measured from the
 * photo noted on each model, scaled so the device fills the `faceSize`, then evened out onto the pitch of the keys.
 * Expect them to be within a millimetre or two.
 */

/** The bounds of a control, from its centre */
function centredBounds(x: number, y: number, width: number, height: number): BlackmagicControllerControlBounds {
	const round = (value: number) => Math.round(value * 10) / 10
	return { x: round(x - width / 2), y: round(y - height / 2), width, height }
}

/**
 * ATEM Micro Panel, which is 410x136mm.
 * Measured from https://images.blackmagicdesign.com/images/webstore/products/W-ABP-11/2_hero.jpg
 */
const atemMicroPanelKey = (x: number, y: number) => centredBounds(x, y, 16.2, 16.2)

export const atemMicroPanelProperties: BlackmagicControllerStaticProperties = {
	controls: freezeDefinitions([
		createRgbButtonDefinition(0, 5, 'macro', 0x01, 16, atemMicroPanelKey(114.3, 31.1)),

		createRgbButtonDefinition(0, 6, 'key1-on', 0x02, 19, atemMicroPanelKey(131.4, 31.1)),
		createRgbButtonDefinition(0, 7, 'key2-on', 0x03, 22, atemMicroPanelKey(148.5, 31.1)),
		createRgbButtonDefinition(0, 8, 'key3-on', 0x04, 25, atemMicroPanelKey(165.6, 31.1)),
		createRgbButtonDefinition(0, 9, 'key4-on', 0x05, 28, atemMicroPanelKey(182.7, 31.1)),

		createRgbButtonDefinition(1, 5, 'next-background', 0x06, 31, atemMicroPanelKey(114.3, 48.2)),
		createRgbButtonDefinition(1, 6, 'next-key1', 0x07, 34, atemMicroPanelKey(131.4, 48.2)),
		createRgbButtonDefinition(1, 7, 'next-key2', 0x08, 37, atemMicroPanelKey(148.5, 48.2)),
		createRgbButtonDefinition(1, 8, 'next-key3', 0x09, 40, atemMicroPanelKey(165.6, 48.2)),
		createRgbButtonDefinition(1, 9, 'next-key4', 0x0a, 43, atemMicroPanelKey(182.7, 48.2)),

		createRgbButtonDefinition(2, 0, 'program1', 0x0b, 46, atemMicroPanelKey(28.8, 76.1)),
		createRgbButtonDefinition(2, 1, 'program2', 0x0c, 49, atemMicroPanelKey(45.9, 76.1)),
		createRgbButtonDefinition(2, 2, 'program3', 0x0d, 52, atemMicroPanelKey(63, 76.1)),
		createRgbButtonDefinition(2, 3, 'program4', 0x0e, 55, atemMicroPanelKey(80.1, 76.1)),
		createRgbButtonDefinition(2, 4, 'program5', 0x0f, 58, atemMicroPanelKey(97.2, 76.1)),
		createRgbButtonDefinition(2, 5, 'program6', 0x10, 61, atemMicroPanelKey(114.3, 76.1)),
		createRgbButtonDefinition(2, 6, 'program7', 0x11, 64, atemMicroPanelKey(131.4, 76.1)),
		createRgbButtonDefinition(2, 7, 'program8', 0x12, 67, atemMicroPanelKey(148.5, 76.1)),
		createRgbButtonDefinition(2, 8, 'program9', 0x13, 70, atemMicroPanelKey(165.6, 76.1)),
		createRgbButtonDefinition(2, 9, 'program10', 0x14, 73, atemMicroPanelKey(182.7, 76.1)),

		createRgbButtonDefinition(3, 0, 'preview1', 0x15, 76, atemMicroPanelKey(28.8, 104.3)),
		createRgbButtonDefinition(3, 1, 'preview2', 0x16, 79, atemMicroPanelKey(45.9, 104.3)),
		createRgbButtonDefinition(3, 2, 'preview3', 0x17, 82, atemMicroPanelKey(63, 104.3)),
		createRgbButtonDefinition(3, 3, 'preview4', 0x18, 85, atemMicroPanelKey(80.1, 104.3)),
		createRgbButtonDefinition(3, 4, 'preview5', 0x19, 88, atemMicroPanelKey(97.2, 104.3)),
		createRgbButtonDefinition(3, 5, 'preview6', 0x1a, 91, atemMicroPanelKey(114.3, 104.3)),
		createRgbButtonDefinition(3, 6, 'preview7', 0x1b, 94, atemMicroPanelKey(131.4, 104.3)),
		createRgbButtonDefinition(3, 7, 'preview8', 0x1c, 97, atemMicroPanelKey(148.5, 104.3)),
		createRgbButtonDefinition(3, 8, 'preview9', 0x1d, 100, atemMicroPanelKey(165.6, 104.3)),
		createRgbButtonDefinition(3, 9, 'preview10', 0x1e, 103, atemMicroPanelKey(182.7, 104.3)),

		createRgbButtonDefinition(0, 10, 'mixeffect1', 0x1f, 106, atemMicroPanelKey(232.8, 31.1)),
		createRgbButtonDefinition(0, 11, 'mixeffect2', 0x20, 109, atemMicroPanelKey(249.9, 31.1)),
		createRgbButtonDefinition(0, 12, 'mixeffect3', 0x21, 112, atemMicroPanelKey(267, 31.1)),
		createRgbButtonDefinition(0, 13, 'mixeffect4', 0x22, 115, atemMicroPanelKey(284.1, 31.1)),

		createRgbButtonDefinition(1, 11, 'transition-dip', 0x23, 118, atemMicroPanelKey(249.9, 59)),
		createRgbButtonDefinition(1, 12, 'transition-dve', 0x24, 121, atemMicroPanelKey(267, 59)),
		createRgbButtonDefinition(1, 13, 'transition-sting', 0x25, 124, atemMicroPanelKey(284.1, 59)),

		createRgbButtonDefinition(2, 11, 'transition-mix', 0x27, 130, atemMicroPanelKey(249.9, 76.1)),
		createRgbButtonDefinition(2, 12, 'transition-wipe', 0x28, 133, atemMicroPanelKey(267, 76.1)),
		createRgbButtonDefinition(2, 13, 'transition-arm', 0x29, 136, atemMicroPanelKey(284.1, 76.1)),

		createRgbButtonDefinition(2, 10, 'shift', 0x26, 127, atemMicroPanelKey(216.6, 76.1)),

		createRgbButtonDefinition(3, 10, 'preview-transition', 0x2a, 139, atemMicroPanelKey(216.6, 104.3)),

		createRgbButtonDefinition(3, 11, 'cut', 0x2b, 142, atemMicroPanelKey(249.9, 104.3)),
		createRgbButtonDefinition(3, 13, 'auto', 0x2c, 145, atemMicroPanelKey(284.1, 104.3)),

		{
			type: 'tbar',
			id: 0,

			row: 0,
			column: 14,
			columnSpan: 1,
			rowSpan: 4,
			// The housing of the T-bar
			bounds: { x: 309, y: 30, width: 30, height: 82.5 },

			ledSegments: 16,
			ledBitIndex: 0,
		},

		createRgbButtonDefinition(1, 15, 'dsk1-tie', 0x2d, 148, atemMicroPanelKey(363.5, 59)),
		createRgbButtonDefinition(1, 16, 'dsk2-tie', 0x2e, 151, atemMicroPanelKey(380.6, 59)),
		createRgbButtonDefinition(2, 15, 'dsk1-cut', 0x2f, 154, atemMicroPanelKey(363.5, 87.2)),
		createRgbButtonDefinition(2, 16, 'dsk2-cut', 0x30, 157, atemMicroPanelKey(380.6, 87.2)),
		createRgbButtonDefinition(3, 15, 'dsk1-auto', 0x31, 160, atemMicroPanelKey(363.5, 104.3)),
		createRgbButtonDefinition(3, 16, 'dsk2-auto', 0x32, 163, atemMicroPanelKey(380.6, 104.3)),
	]),

	faceSize: { width: 410, height: 136 },

	hasBattery: true,
}

/**
 * DaVinci Resolve Replay Editor, which is 380x217mm.
 * Measured from https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_59/590339/19910887_800.jpg
 */
const resolveReplayEditorKey = (x: number, y: number, width = 18) => centredBounds(x, y, width, 18)

export const resolveReplayEditorProperties: BlackmagicControllerStaticProperties = {
	controls: freezeDefinitions([
		createBasicButtonDefinition(0, 0, 'undo', 0x65, null, resolveReplayEditorKey(26.8, 35)),
		createBasicButtonDefinition(0, 1, 'new-tline', 0x3e, null, resolveReplayEditorKey(69.7, 35)),
		createBasicButtonDefinition(0, 6, 'cue', 0x3f, 0, resolveReplayEditorKey(190.9, 35)),
		createBasicButtonDefinition(0, 7, 'run', 0x40, 1, resolveReplayEditorKey(210.2, 35)),
		createBasicButtonDefinition(0, 8, 'dump', 0x41, 2, resolveReplayEditorKey(229.5, 35)),
		createBasicButtonDefinition(0, 10, 'go-to-end', 0x6b, null, resolveReplayEditorKey(268.1, 35)),
		createBasicButtonDefinition(0, 11, 'input-view', 0x42, 3, resolveReplayEditorKey(287.4, 35)),
		createBasicButtonDefinition(0, 12, 'multi-src', 0x43, 4, resolveReplayEditorKey(319.1, 35)),
		createBasicButtonDefinition(0, 14, 'single-clip', 0x44, 5, resolveReplayEditorKey(357.7, 35)),
		createBasicButtonDefinition(1, 1, 'trim-all', 0x3d, null, resolveReplayEditorKey(69.7, 61.7)),
		createBasicButtonDefinition(1, 3, 'ripl-del', 0x2b, null, resolveReplayEditorKey(108.3, 61.7)),
		createBasicButtonDefinition(1, 4, 'video-only', 0x25, 6, resolveReplayEditorKey(140.5, 61.7)),
		createBasicButtonDefinition(1, 5, 'auto-sting', 0x45, 7, resolveReplayEditorKey(159.8, 61.7)),
		createBasicButtonDefinition(1, 6, 'ramp-down', 0x46, null, resolveReplayEditorKey(190.9, 61.7)),
		createBasicButtonDefinition(1, 7, 'speed-pos', 0x47, 8, resolveReplayEditorKey(210.2, 61.7)),
		createBasicButtonDefinition(1, 9, 'sync-bin', 0x1f, null, resolveReplayEditorKey(248.8, 61.7)),
		createBasicButtonDefinition(1, 10, 'add-mark', 0x68, null, resolveReplayEditorKey(268.1, 61.7)),
		createBasicButtonDefinition(1, 11, 'full-view', 0x2d, 9, resolveReplayEditorKey(287.4, 61.7)),
		createBasicButtonDefinition(2, 4, 'audio-only', 0x26, 10, resolveReplayEditorKey(140.5, 81.1)),
		createBasicButtonDefinition(2, 5, 'sel-sting', 0x48, 11, resolveReplayEditorKey(159.8, 81.1)),
		createBasicButtonDefinition(2, 6, 'slow', 0x49, null, resolveReplayEditorKey(190.9, 81.1)),
		createBasicButtonDefinition(2, 7, 'set-speed', 0x4a, 12, resolveReplayEditorKey(210.2, 81.1)),
		createBasicButtonDefinition(2, 9, 'split', 0x2f, null, resolveReplayEditorKey(248.8, 81.1)),
		createBasicButtonDefinition(2, 10, 'snap', 0x2e, 13, resolveReplayEditorKey(268.1, 81.1)),
		createBasicButtonDefinition(2, 11, 'mv-view', 0x4b, 14, resolveReplayEditorKey(287.4, 81.1)),
		createBasicButtonDefinition(2, 12, 'source', 0x1a, null, resolveReplayEditorKey(323.9, 81.1, 27.6)),
		createBasicButtonDefinition(2, 14, 'timeline', 0x1b, null, resolveReplayEditorKey(352.9, 81.1, 27.6)),
		createBasicButtonDefinition(3, 0, 'live-speed', 0x63, 15, resolveReplayEditorKey(32.6, 88.8, 27.4)),
		createBasicButtonDefinition(3, 1, 'smart-insert', 0x01, null, resolveReplayEditorKey(69.7, 88.8)),
		createBasicButtonDefinition(3, 2, 'appnd', 0x02, null, resolveReplayEditorKey(89, 88.8)),
		createBasicButtonDefinition(3, 3, 'ripl-owr', 0x03, null, resolveReplayEditorKey(108.3, 88.8)),
		createBasicButtonDefinition(4, 1, 'close-up', 0x04, 16, resolveReplayEditorKey(69.7, 108.1)),
		createBasicButtonDefinition(4, 2, 'place-on-top', 0x05, null, resolveReplayEditorKey(89, 108.1)),
		createBasicButtonDefinition(4, 3, 'src-owr', 0x06, null, resolveReplayEditorKey(108.3, 108.1)),
		createBasicButtonDefinition(4, 4, 'set-poi', 0x4d, 17, resolveReplayEditorKey(140.5, 108.1)),
		createBasicButtonDefinition(4, 5, 'go-to-poi', 0x4c, null, resolveReplayEditorKey(159.8, 108.1)),
		createBasicButtonDefinition(4, 6, '2sec', 0x5d, 18, resolveReplayEditorKey(190.9, 108.1)),
		createBasicButtonDefinition(4, 7, '3sec', 0x5e, 19, resolveReplayEditorKey(210.2, 108.1)),
		createBasicButtonDefinition(4, 8, '4sec', 0x5f, 20, resolveReplayEditorKey(229.5, 108.1)),
		createBasicButtonDefinition(4, 9, '5sec', 0x60, 21, resolveReplayEditorKey(248.8, 108.1)),
		createBasicButtonDefinition(4, 10, '6sec', 0x61, 22, resolveReplayEditorKey(268.1, 108.1)),
		createBasicButtonDefinition(4, 11, '7sec', 0x62, 23, resolveReplayEditorKey(287.4, 108.1)),
		createBasicButtonDefinition(4, 12, 'slow-jog', 0x69, -4, resolveReplayEditorKey(319.1, 108.1)), // this negative is a hack, to differentiate them to the special command
		createBasicButtonDefinition(4, 13, 'jog-jog', 0x1d, -1, resolveReplayEditorKey(338.4, 108.1)), // this negative is a hack, to differentiate them to the special command
		createBasicButtonDefinition(4, 14, 'scrl-jog', 0x1e, -3, resolveReplayEditorKey(357.7, 108.1)), // this negative is a hack, to differentiate them to the special command
		createBasicButtonDefinition(5, 1, 'in', 0x07, null, resolveReplayEditorKey(74.5, 134, 27.6)),
		createBasicButtonDefinition(5, 3, 'out', 0x08, null, resolveReplayEditorKey(103.5, 134, 27.6)),
		createBasicButtonDefinition(5, 4, 'all-cams', 0x64, 24, resolveReplayEditorKey(140.5, 134)),
		createBasicButtonDefinition(5, 5, 'cams-9-16', 0x5c, 25, resolveReplayEditorKey(159.8, 134)),
		createBasicButtonDefinition(5, 6, 'title1', 0x4e, 26, resolveReplayEditorKey(190.9, 134)),
		createBasicButtonDefinition(5, 7, 'title2', 0x4f, 27, resolveReplayEditorKey(210.2, 134)),
		createBasicButtonDefinition(5, 8, 'title3', 0x50, 28, resolveReplayEditorKey(229.5, 134)),
		createBasicButtonDefinition(5, 9, 'title4', 0x51, 29, resolveReplayEditorKey(248.8, 134)),
		createBasicButtonDefinition(5, 10, 'title5', 0x52, 30, resolveReplayEditorKey(268.1, 134)),
		createBasicButtonDefinition(5, 11, 'title6', 0x53, 31, resolveReplayEditorKey(287.4, 134)),
		createBasicButtonDefinition(6, 1, 'trim-in', 0x09, null, resolveReplayEditorKey(69.7, 152.9)),
		createBasicButtonDefinition(6, 2, 'trim-out', 0x0a, null, resolveReplayEditorKey(89, 152.9)),
		createBasicButtonDefinition(6, 3, 'roll', 0x0b, null, resolveReplayEditorKey(108.3, 152.9)),
		createBasicButtonDefinition(7, 1, 'slip', 0x67, null, resolveReplayEditorKey(69.7, 172.2)),
		createBasicButtonDefinition(7, 2, 'slide', 0x66, null, resolveReplayEditorKey(89, 172.2)),
		createBasicButtonDefinition(7, 3, 'trans-dur', 0x0e, null, resolveReplayEditorKey(108.3, 172.2)),
		createBasicButtonDefinition(7, 4, 'cam1', 0x54, 32, resolveReplayEditorKey(140.5, 162.2)),
		createBasicButtonDefinition(7, 5, 'cam2', 0x55, 33, resolveReplayEditorKey(159.8, 162.2)),
		createBasicButtonDefinition(7, 6, 'cam3', 0x56, 34, resolveReplayEditorKey(179.1, 162.2)),
		createBasicButtonDefinition(7, 7, 'cam4', 0x57, 35, resolveReplayEditorKey(198.4, 162.2)),
		createBasicButtonDefinition(7, 8, 'cam5', 0x58, 36, resolveReplayEditorKey(229.5, 162.2)),
		createBasicButtonDefinition(7, 9, 'cam6', 0x59, 37, resolveReplayEditorKey(248.8, 162.2)),
		createBasicButtonDefinition(7, 10, 'cam7', 0x5a, 38, resolveReplayEditorKey(268.1, 162.2)),
		createBasicButtonDefinition(7, 11, 'cam8', 0x5b, 39, resolveReplayEditorKey(287.4, 162.2)),
		createBasicButtonDefinition(8, 1, 'cut', 0x0f, 40, resolveReplayEditorKey(69.7, 191.5)),
		createBasicButtonDefinition(8, 2, 'dis', 0x10, 41, resolveReplayEditorKey(89, 191.5)),
		createBasicButtonDefinition(8, 3, 'trans', 0x22, 42, resolveReplayEditorKey(108.3, 191.5)),
		createBasicButtonDefinition(8, 4, 'stop-play', 0x3c, null, resolveReplayEditorKey(214, 191.5, 164.8)),

		{
			type: 'tbar',
			id: 0,

			row: 4,
			column: 0,
			columnSpan: 1,
			rowSpan: 5,
			// The housing of the T-bar
			bounds: { x: 18.6, y: 108, width: 28.6, height: 81.5 },

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
			bounds: centredBounds(341.4, 163.4, 59, 59),
		},
	]),

	faceSize: { width: 380, height: 217 },

	hasBattery: true,
}

/**
 * DaVinci Resolve Speed Editor, which is 245x156mm.
 * Measured from https://images.blackmagicdesign.com/images/media/releases/2020/20201109_davinci-resolve-speed-editor/carousel/4-davinci-resolve-speed-editor.jpg
 */
const resolveSpeedEditorKey = (x: number, y: number, width = 17.7) => centredBounds(x, y, width, 17.7)

export const resolveSpeedEditorProperties: BlackmagicControllerStaticProperties = {
	controls: freezeDefinitions([
		createBasicButtonDefinition(0, 0, 'smart-insert', 0x01, null, resolveSpeedEditorKey(22.7, 30.1)),
		createBasicButtonDefinition(0, 1, 'append', 0x02, null, resolveSpeedEditorKey(41.8, 30.1)),
		createBasicButtonDefinition(0, 2, 'ripple-owr', 0x03, null, resolveSpeedEditorKey(60.8, 30.1)),
		createBasicButtonDefinition(0, 3, 'esc', 0x31, null, resolveSpeedEditorKey(93.7, 30.1)),
		createBasicButtonDefinition(0, 4, 'sync-bin', 0x1f, null, resolveSpeedEditorKey(112.8, 30.1)),
		createBasicButtonDefinition(0, 5, 'audio-level', 0x2c, null, resolveSpeedEditorKey(131.8, 30.1)),
		createBasicButtonDefinition(0, 6, 'pull-view', 0x2d, null, resolveSpeedEditorKey(150.9, 30.1)),
		createBasicButtonDefinition(0, 7, 'source', 0x1a, null, resolveSpeedEditorKey(188.8, 30.1, 26.9)),
		createBasicButtonDefinition(0, 9, 'timeline', 0x1b, null, resolveSpeedEditorKey(217, 30.1, 26.9)),

		createBasicButtonDefinition(1, 0, 'close-up', 0x04, 0x00, resolveSpeedEditorKey(22.7, 49.2)),
		createBasicButtonDefinition(1, 1, 'place-on-top', 0x05, null, resolveSpeedEditorKey(41.8, 49.2)),
		createBasicButtonDefinition(1, 2, 'src-owr', 0x06, null, resolveSpeedEditorKey(60.8, 49.2)),
		createBasicButtonDefinition(1, 3, 'trans', 0x22, 0x04, resolveSpeedEditorKey(93.7, 49.2)),
		createBasicButtonDefinition(1, 4, 'split', 0x2f, null, resolveSpeedEditorKey(112.8, 49.2)),
		createBasicButtonDefinition(1, 5, 'snap', 0x2e, 0x05, resolveSpeedEditorKey(131.8, 49.2)),
		createBasicButtonDefinition(1, 6, 'ripl-del', 0x2b, null, resolveSpeedEditorKey(150.9, 49.2)),
		createBasicButtonDefinition(1, 7, 'jog-shtl', 0x1c, -2, resolveSpeedEditorKey(183.8, 56.6)), // this negative is a hack, to differentiate them to the special command
		createBasicButtonDefinition(1, 8, 'jog-jog', 0x1d, -1, resolveSpeedEditorKey(202.8, 56.6)), // this negative is a hack, to differentiate them to the special command
		createBasicButtonDefinition(1, 9, 'jog-scrl', 0x1e, -3, resolveSpeedEditorKey(221.8, 56.6)), // this negative is a hack, to differentiate them to the special command

		createBasicButtonDefinition(2, 0, 'in', 0x07, null, resolveSpeedEditorKey(27.5, 75.6, 27.3)),
		createBasicButtonDefinition(2, 2, 'out', 0x08, null, resolveSpeedEditorKey(56.1, 75.6, 27.3)),
		createBasicButtonDefinition(2, 3, 'cam7', 0x39, 0x06, resolveSpeedEditorKey(93.7, 75.6)),
		createBasicButtonDefinition(2, 4, 'cam8', 0x3a, 0x07, resolveSpeedEditorKey(112.8, 75.6)),
		createBasicButtonDefinition(2, 5, 'cam9', 0x3b, 0x08, resolveSpeedEditorKey(131.8, 75.6)),
		createBasicButtonDefinition(2, 6, 'live-owr', 0x30, 0x09, resolveSpeedEditorKey(150.9, 75.6)),

		createBasicButtonDefinition(3, 0, 'trim-in', 0x09, null, resolveSpeedEditorKey(22.7, 94.7)),
		createBasicButtonDefinition(3, 1, 'trim-out', 0x0a, null, resolveSpeedEditorKey(41.8, 94.7)),
		createBasicButtonDefinition(3, 2, 'roll', 0x0b, null, resolveSpeedEditorKey(60.8, 94.7)),
		createBasicButtonDefinition(3, 3, 'cam4', 0x36, 0x0a, resolveSpeedEditorKey(93.7, 94.7)),
		createBasicButtonDefinition(3, 4, 'cam5', 0x37, 0x0b, resolveSpeedEditorKey(112.8, 94.7)),
		createBasicButtonDefinition(3, 5, 'cam6', 0x38, 0x0c, resolveSpeedEditorKey(131.8, 94.7)),
		createBasicButtonDefinition(3, 6, 'video-only', 0x25, 0x0d, resolveSpeedEditorKey(150.9, 94.7)),

		createBasicButtonDefinition(4, 0, 'slip-src', 0x0c, null, resolveSpeedEditorKey(22.7, 113.8)),
		createBasicButtonDefinition(4, 1, 'slip-dest', 0x0d, null, resolveSpeedEditorKey(41.8, 113.8)),
		createBasicButtonDefinition(4, 2, 'trans-dur', 0x0e, null, resolveSpeedEditorKey(60.8, 113.8)),
		createBasicButtonDefinition(4, 3, 'cam1', 0x33, 0x0e, resolveSpeedEditorKey(93.7, 113.8)),
		createBasicButtonDefinition(4, 4, 'cam2', 0x34, 0x0f, resolveSpeedEditorKey(112.8, 113.8)),
		createBasicButtonDefinition(4, 5, 'cam3', 0x35, 0x10, resolveSpeedEditorKey(131.8, 113.8)),
		createBasicButtonDefinition(4, 6, 'audio-only', 0x26, 0x11, resolveSpeedEditorKey(150.9, 113.8)),

		createBasicButtonDefinition(5, 0, 'cut', 0x0f, 0x01, resolveSpeedEditorKey(22.7, 132.8)),
		createBasicButtonDefinition(5, 1, 'dis', 0x10, 0x02, resolveSpeedEditorKey(41.8, 132.8)),
		createBasicButtonDefinition(5, 2, 'smth-cut', 0x11, 0x03, resolveSpeedEditorKey(60.8, 132.8)),
		createBasicButtonDefinition(5, 3, 'stop-play', 0x3c, null, resolveSpeedEditorKey(122.3, 132.8, 74.9)),

		{
			type: 'jog',
			id: 0,
			row: 2,
			column: 7,
			columnSpan: 3,
			rowSpan: 4,
			bounds: centredBounds(203, 112.5, 60, 60),
		},
	]),

	faceSize: { width: 245, height: 156 },

	hasBattery: true,
}
