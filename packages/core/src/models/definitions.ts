import type { BlackmagicControllerControlBounds } from '../controlDefinition.js'
import type { GridLayout } from '../controlsGenerator.js'
import {
	createBasicButtonDefinition,
	createRgbButtonDefinition,
	freezeDefinitions,
	gridBounds,
} from '../controlsGenerator.js'
import type { BlackmagicControllerStaticProperties } from './base.js'

/**
 * The static properties of each model.
 *
 * Note: this module must not import anything which pulls in the services used to drive a device,
 * so that `DEVICE_MODEL_INFO` can be consumed without them.
 *
 * The `faceSize` of each model is its published width and depth, in millimetres.
 * The `bounds` of every control are estimates: they are derived from the `row` and `column` of each control,
 * with a plausible key pitch and gaps between the sections of the panel. They are not measured.
 */

interface GridPosition {
	/** Override the column used to position the control, for controls offset by part of a column */
	column?: number
	columnSpan?: number
	rowSpan?: number
}

function createGrid(
	layout: GridLayout,
): (row: number, column: number, position?: GridPosition) => BlackmagicControllerControlBounds {
	return (row, column, position) =>
		gridBounds(layout, position?.column ?? column, row, position?.columnSpan, position?.rowSpan)
}

/**
 * ATEM Micro Panel, which is 410x136mm.
 * The panel has three sections: the program/preview rows, the transition controls and the T-bar with the DSK buttons
 */
const atemMicroPanelGrid = createGrid({
	left: 23,
	top: 28,
	columnPitch: 20,
	rowPitch: 20,
	gap: 3,
	columnBreaks: { 10: 8, 14: 8, 15: 8 },
})

export const atemMicroPanelProperties: BlackmagicControllerStaticProperties = {
	controls: freezeDefinitions([
		createRgbButtonDefinition(0, 5, 'macro', 0x01, 16, atemMicroPanelGrid(0, 5)),

		createRgbButtonDefinition(0, 6, 'key1-on', 0x02, 19, atemMicroPanelGrid(0, 6)),
		createRgbButtonDefinition(0, 7, 'key2-on', 0x03, 22, atemMicroPanelGrid(0, 7)),
		createRgbButtonDefinition(0, 8, 'key3-on', 0x04, 25, atemMicroPanelGrid(0, 8)),
		createRgbButtonDefinition(0, 9, 'key4-on', 0x05, 28, atemMicroPanelGrid(0, 9)),

		createRgbButtonDefinition(1, 5, 'next-background', 0x06, 31, atemMicroPanelGrid(1, 5)),
		createRgbButtonDefinition(1, 6, 'next-key1', 0x07, 34, atemMicroPanelGrid(1, 6)),
		createRgbButtonDefinition(1, 7, 'next-key2', 0x08, 37, atemMicroPanelGrid(1, 7)),
		createRgbButtonDefinition(1, 8, 'next-key3', 0x09, 40, atemMicroPanelGrid(1, 8)),
		createRgbButtonDefinition(1, 9, 'next-key4', 0x0a, 43, atemMicroPanelGrid(1, 9)),

		createRgbButtonDefinition(2, 0, 'program1', 0x0b, 46, atemMicroPanelGrid(2, 0)),
		createRgbButtonDefinition(2, 1, 'program2', 0x0c, 49, atemMicroPanelGrid(2, 1)),
		createRgbButtonDefinition(2, 2, 'program3', 0x0d, 52, atemMicroPanelGrid(2, 2)),
		createRgbButtonDefinition(2, 3, 'program4', 0x0e, 55, atemMicroPanelGrid(2, 3)),
		createRgbButtonDefinition(2, 4, 'program5', 0x0f, 58, atemMicroPanelGrid(2, 4)),
		createRgbButtonDefinition(2, 5, 'program6', 0x10, 61, atemMicroPanelGrid(2, 5)),
		createRgbButtonDefinition(2, 6, 'program7', 0x11, 64, atemMicroPanelGrid(2, 6)),
		createRgbButtonDefinition(2, 7, 'program8', 0x12, 67, atemMicroPanelGrid(2, 7)),
		createRgbButtonDefinition(2, 8, 'program9', 0x13, 70, atemMicroPanelGrid(2, 8)),
		createRgbButtonDefinition(2, 9, 'program10', 0x14, 73, atemMicroPanelGrid(2, 9)),

		createRgbButtonDefinition(3, 0, 'preview1', 0x15, 76, atemMicroPanelGrid(3, 0)),
		createRgbButtonDefinition(3, 1, 'preview2', 0x16, 79, atemMicroPanelGrid(3, 1)),
		createRgbButtonDefinition(3, 2, 'preview3', 0x17, 82, atemMicroPanelGrid(3, 2)),
		createRgbButtonDefinition(3, 3, 'preview4', 0x18, 85, atemMicroPanelGrid(3, 3)),
		createRgbButtonDefinition(3, 4, 'preview5', 0x19, 88, atemMicroPanelGrid(3, 4)),
		createRgbButtonDefinition(3, 5, 'preview6', 0x1a, 91, atemMicroPanelGrid(3, 5)),
		createRgbButtonDefinition(3, 6, 'preview7', 0x1b, 94, atemMicroPanelGrid(3, 6)),
		createRgbButtonDefinition(3, 7, 'preview8', 0x1c, 97, atemMicroPanelGrid(3, 7)),
		createRgbButtonDefinition(3, 8, 'preview9', 0x1d, 100, atemMicroPanelGrid(3, 8)),
		createRgbButtonDefinition(3, 9, 'preview10', 0x1e, 103, atemMicroPanelGrid(3, 9)),

		createRgbButtonDefinition(0, 10, 'mixeffect1', 0x1f, 106, atemMicroPanelGrid(0, 10)),
		createRgbButtonDefinition(0, 11, 'mixeffect2', 0x20, 109, atemMicroPanelGrid(0, 11)),
		createRgbButtonDefinition(0, 12, 'mixeffect3', 0x21, 112, atemMicroPanelGrid(0, 12)),
		createRgbButtonDefinition(0, 13, 'mixeffect4', 0x22, 115, atemMicroPanelGrid(0, 13)),

		createRgbButtonDefinition(1, 11, 'transition-dip', 0x23, 118, atemMicroPanelGrid(1, 11)),
		createRgbButtonDefinition(1, 12, 'transition-dve', 0x24, 121, atemMicroPanelGrid(1, 12)),
		createRgbButtonDefinition(1, 13, 'transition-sting', 0x25, 124, atemMicroPanelGrid(1, 13)),

		createRgbButtonDefinition(2, 11, 'transition-mix', 0x27, 130, atemMicroPanelGrid(2, 11)),
		createRgbButtonDefinition(2, 12, 'transition-wipe', 0x28, 133, atemMicroPanelGrid(2, 12)),
		createRgbButtonDefinition(2, 13, 'transition-arm', 0x29, 136, atemMicroPanelGrid(2, 13)),

		createRgbButtonDefinition(2, 10, 'shift', 0x26, 127, atemMicroPanelGrid(2, 10)),

		createRgbButtonDefinition(3, 10, 'preview-transition', 0x2a, 139, atemMicroPanelGrid(3, 10)),

		// Cut and auto are wider keys, sharing the three columns above them
		createRgbButtonDefinition(3, 11, 'cut', 0x2b, 142, atemMicroPanelGrid(3, 11, { columnSpan: 1.5 })),
		createRgbButtonDefinition(
			3,
			13,
			'auto',
			0x2c,
			145,
			atemMicroPanelGrid(3, 13, { column: 12.5, columnSpan: 1.5 }),
		),

		{
			type: 'tbar',
			id: 0,

			row: 0,
			column: 14,
			columnSpan: 1,
			rowSpan: 4,
			bounds: atemMicroPanelGrid(0, 14, { rowSpan: 4 }),

			ledSegments: 16,
			ledBitIndex: 0,
		},

		createRgbButtonDefinition(1, 15, 'dsk1-tie', 0x2d, 148, atemMicroPanelGrid(1, 15)),
		createRgbButtonDefinition(1, 16, 'dsk2-tie', 0x2e, 151, atemMicroPanelGrid(1, 16)),
		createRgbButtonDefinition(2, 15, 'dsk1-cut', 0x2f, 154, atemMicroPanelGrid(2, 15)),
		createRgbButtonDefinition(2, 16, 'dsk2-cut', 0x30, 157, atemMicroPanelGrid(2, 16)),
		createRgbButtonDefinition(3, 15, 'dsk1-auto', 0x31, 160, atemMicroPanelGrid(3, 15)),
		createRgbButtonDefinition(3, 16, 'dsk2-auto', 0x32, 163, atemMicroPanelGrid(3, 16)),
	]),

	faceSize: { width: 410, height: 136 },

	hasBattery: true,
}

/**
 * DaVinci Resolve Replay Editor, which is 380x217mm.
 * The panel has four sections: the T-bar, the edit keys, the replay keys and the jog wheel
 */
const resolveReplayEditorGrid = createGrid({
	left: 25,
	top: 24,
	columnPitch: 21,
	rowPitch: 19,
	gap: 3,
	columnBreaks: { 1: 6, 4: 6, 12: 6 },
})

export const resolveReplayEditorProperties: BlackmagicControllerStaticProperties = {
	controls: freezeDefinitions([
		createBasicButtonDefinition(0, 0, 'undo', 0x65, null, resolveReplayEditorGrid(0, 0)),
		createBasicButtonDefinition(0, 1, 'new-tline', 0x3e, null, resolveReplayEditorGrid(0, 1)),
		createBasicButtonDefinition(0, 6, 'cue', 0x3f, 0, resolveReplayEditorGrid(0, 6)),
		createBasicButtonDefinition(0, 7, 'run', 0x40, 1, resolveReplayEditorGrid(0, 7)),
		createBasicButtonDefinition(0, 8, 'dump', 0x41, 2, resolveReplayEditorGrid(0, 8)),
		createBasicButtonDefinition(0, 10, 'go-to-end', 0x6b, null, resolveReplayEditorGrid(0, 10)),
		createBasicButtonDefinition(0, 11, 'input-view', 0x42, 3, resolveReplayEditorGrid(0, 11)),
		createBasicButtonDefinition(0, 12, 'multi-src', 0x43, 4, resolveReplayEditorGrid(0, 12)),
		createBasicButtonDefinition(0, 14, 'single-clip', 0x44, 5, resolveReplayEditorGrid(0, 14)),
		createBasicButtonDefinition(1, 1, 'trim-all', 0x3d, null, resolveReplayEditorGrid(1, 1)),
		createBasicButtonDefinition(1, 3, 'ripl-del', 0x2b, null, resolveReplayEditorGrid(1, 3)),
		createBasicButtonDefinition(1, 4, 'video-only', 0x25, 6, resolveReplayEditorGrid(1, 4)),
		createBasicButtonDefinition(1, 5, 'auto-sting', 0x45, 7, resolveReplayEditorGrid(1, 5)),
		createBasicButtonDefinition(1, 6, 'ramp-down', 0x46, null, resolveReplayEditorGrid(1, 6)),
		createBasicButtonDefinition(1, 7, 'speed-pos', 0x47, 8, resolveReplayEditorGrid(1, 7)),
		createBasicButtonDefinition(1, 9, 'sync-bin', 0x1f, null, resolveReplayEditorGrid(1, 9)),
		createBasicButtonDefinition(1, 10, 'add-mark', 0x68, null, resolveReplayEditorGrid(1, 10)),
		createBasicButtonDefinition(1, 11, 'full-view', 0x2d, 9, resolveReplayEditorGrid(1, 11)),
		createBasicButtonDefinition(2, 4, 'audio-only', 0x26, 10, resolveReplayEditorGrid(2, 4)),
		createBasicButtonDefinition(2, 5, 'sel-sting', 0x48, 11, resolveReplayEditorGrid(2, 5)),
		createBasicButtonDefinition(2, 6, 'slow', 0x49, null, resolveReplayEditorGrid(2, 6)),
		createBasicButtonDefinition(2, 7, 'set-speed', 0x4a, 12, resolveReplayEditorGrid(2, 7)),
		createBasicButtonDefinition(2, 9, 'split', 0x2f, null, resolveReplayEditorGrid(2, 9)),
		createBasicButtonDefinition(2, 10, 'snap', 0x2e, 13, resolveReplayEditorGrid(2, 10)),
		createBasicButtonDefinition(2, 11, 'mv-view', 0x4b, 14, resolveReplayEditorGrid(2, 11)),
		createBasicButtonDefinition(2, 12, 'source', 0x1a, null, resolveReplayEditorGrid(2, 12)),
		createBasicButtonDefinition(2, 14, 'timeline', 0x1b, null, resolveReplayEditorGrid(2, 14)),
		createBasicButtonDefinition(3, 0, 'live-speed', 0x63, 15, resolveReplayEditorGrid(3, 0)),
		createBasicButtonDefinition(3, 1, 'smart-insert', 0x01, null, resolveReplayEditorGrid(3, 1)),
		createBasicButtonDefinition(3, 2, 'appnd', 0x02, null, resolveReplayEditorGrid(3, 2)),
		createBasicButtonDefinition(3, 3, 'ripl-owr', 0x03, null, resolveReplayEditorGrid(3, 3)),
		createBasicButtonDefinition(4, 1, 'close-up', 0x04, 16, resolveReplayEditorGrid(4, 1)),
		createBasicButtonDefinition(4, 2, 'place-on-top', 0x05, null, resolveReplayEditorGrid(4, 2)),
		createBasicButtonDefinition(4, 3, 'src-owr', 0x06, null, resolveReplayEditorGrid(4, 3)),
		createBasicButtonDefinition(4, 4, 'set-poi', 0x4d, 17, resolveReplayEditorGrid(4, 4)),
		createBasicButtonDefinition(4, 5, 'go-to-poi', 0x4c, null, resolveReplayEditorGrid(4, 5)),
		createBasicButtonDefinition(4, 6, '2sec', 0x5d, 18, resolveReplayEditorGrid(4, 6)),
		createBasicButtonDefinition(4, 7, '3sec', 0x5e, 19, resolveReplayEditorGrid(4, 7)),
		createBasicButtonDefinition(4, 8, '4sec', 0x5f, 20, resolveReplayEditorGrid(4, 8)),
		createBasicButtonDefinition(4, 9, '5sec', 0x60, 21, resolveReplayEditorGrid(4, 9)),
		createBasicButtonDefinition(4, 10, '6sec', 0x61, 22, resolveReplayEditorGrid(4, 10)),
		createBasicButtonDefinition(4, 11, '7sec', 0x62, 23, resolveReplayEditorGrid(4, 11)),
		createBasicButtonDefinition(4, 12, 'slow-jog', 0x69, -4, resolveReplayEditorGrid(4, 12)), // this negative is a hack, to differentiate them to the special command
		createBasicButtonDefinition(4, 13, 'jog-jog', 0x1d, -1, resolveReplayEditorGrid(4, 13)), // this negative is a hack, to differentiate them to the special command
		createBasicButtonDefinition(4, 14, 'scrl-jog', 0x1e, -3, resolveReplayEditorGrid(4, 14)), // this negative is a hack, to differentiate them to the special command
		// In and out are wider keys, sharing the three columns above them
		createBasicButtonDefinition(5, 1, 'in', 0x07, null, resolveReplayEditorGrid(5, 1, { columnSpan: 1.5 })),
		createBasicButtonDefinition(
			5,
			3,
			'out',
			0x08,
			null,
			resolveReplayEditorGrid(5, 3, { column: 2.5, columnSpan: 1.5 }),
		),
		createBasicButtonDefinition(5, 4, 'all-cams', 0x64, 24, resolveReplayEditorGrid(5, 4)),
		createBasicButtonDefinition(5, 5, 'cams-9-16', 0x5c, 25, resolveReplayEditorGrid(5, 5)),
		createBasicButtonDefinition(5, 6, 'title1', 0x4e, 26, resolveReplayEditorGrid(5, 6)),
		createBasicButtonDefinition(5, 7, 'title2', 0x4f, 27, resolveReplayEditorGrid(5, 7)),
		createBasicButtonDefinition(5, 8, 'title3', 0x50, 28, resolveReplayEditorGrid(5, 8)),
		createBasicButtonDefinition(5, 9, 'title4', 0x51, 29, resolveReplayEditorGrid(5, 9)),
		createBasicButtonDefinition(5, 10, 'title5', 0x52, 30, resolveReplayEditorGrid(5, 10)),
		createBasicButtonDefinition(5, 11, 'title6', 0x53, 31, resolveReplayEditorGrid(5, 11)),
		createBasicButtonDefinition(6, 1, 'trim-in', 0x09, null, resolveReplayEditorGrid(6, 1)),
		createBasicButtonDefinition(6, 2, 'trim-out', 0x0a, null, resolveReplayEditorGrid(6, 2)),
		createBasicButtonDefinition(6, 3, 'roll', 0x0b, null, resolveReplayEditorGrid(6, 3)),
		createBasicButtonDefinition(7, 1, 'slip', 0x67, null, resolveReplayEditorGrid(7, 1)),
		createBasicButtonDefinition(7, 2, 'slide', 0x66, null, resolveReplayEditorGrid(7, 2)),
		createBasicButtonDefinition(7, 3, 'trans-dur', 0x0e, null, resolveReplayEditorGrid(7, 3)),
		createBasicButtonDefinition(7, 4, 'cam1', 0x54, 32, resolveReplayEditorGrid(7, 4)),
		createBasicButtonDefinition(7, 5, 'cam2', 0x55, 33, resolveReplayEditorGrid(7, 5)),
		createBasicButtonDefinition(7, 6, 'cam3', 0x56, 34, resolveReplayEditorGrid(7, 6)),
		createBasicButtonDefinition(7, 7, 'cam4', 0x57, 35, resolveReplayEditorGrid(7, 7)),
		createBasicButtonDefinition(7, 8, 'cam5', 0x58, 36, resolveReplayEditorGrid(7, 8)),
		createBasicButtonDefinition(7, 9, 'cam6', 0x59, 37, resolveReplayEditorGrid(7, 9)),
		createBasicButtonDefinition(7, 10, 'cam7', 0x5a, 38, resolveReplayEditorGrid(7, 10)),
		createBasicButtonDefinition(7, 11, 'cam8', 0x5b, 39, resolveReplayEditorGrid(7, 11)),
		createBasicButtonDefinition(8, 1, 'cut', 0x0f, 40, resolveReplayEditorGrid(8, 1)),
		createBasicButtonDefinition(8, 2, 'dis', 0x10, 41, resolveReplayEditorGrid(8, 2)),
		createBasicButtonDefinition(8, 3, 'trans', 0x22, 42, resolveReplayEditorGrid(8, 3)),
		createBasicButtonDefinition(8, 4, 'stop-play', 0x3c, null, resolveReplayEditorGrid(8, 4)),

		{
			type: 'tbar',
			id: 0,

			row: 4,
			column: 0,
			columnSpan: 1,
			rowSpan: 5,
			bounds: resolveReplayEditorGrid(4, 0, { rowSpan: 5 }),

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
			bounds: resolveReplayEditorGrid(5, 12, { columnSpan: 3, rowSpan: 4 }),
		},
	]),

	faceSize: { width: 380, height: 217 },

	hasBattery: true,
}

/**
 * DaVinci Resolve Speed Editor, which is 245x156mm.
 * The panel has three sections: the edit keys, the camera keys and the jog wheel
 */
const resolveSpeedEditorGrid = createGrid({
	left: 18,
	top: 22,
	columnPitch: 19,
	rowPitch: 19,
	gap: 3,
	columnBreaks: { 3: 8, 7: 8 },
})

export const resolveSpeedEditorProperties: BlackmagicControllerStaticProperties = {
	controls: freezeDefinitions([
		createBasicButtonDefinition(0, 0, 'smart-insert', 0x01, null, resolveSpeedEditorGrid(0, 0)),
		createBasicButtonDefinition(0, 1, 'append', 0x02, null, resolveSpeedEditorGrid(0, 1)),
		createBasicButtonDefinition(0, 2, 'ripple-owr', 0x03, null, resolveSpeedEditorGrid(0, 2)),
		createBasicButtonDefinition(0, 3, 'esc', 0x31, null, resolveSpeedEditorGrid(0, 3)),
		createBasicButtonDefinition(0, 4, 'sync-bin', 0x1f, null, resolveSpeedEditorGrid(0, 4)),
		createBasicButtonDefinition(0, 5, 'audio-level', 0x2c, null, resolveSpeedEditorGrid(0, 5)),
		createBasicButtonDefinition(0, 6, 'pull-view', 0x2d, null, resolveSpeedEditorGrid(0, 6)),
		// Source and timeline are wider keys, sharing the three columns below them
		createBasicButtonDefinition(0, 7, 'source', 0x1a, null, resolveSpeedEditorGrid(0, 7, { columnSpan: 1.5 })),
		createBasicButtonDefinition(
			0,
			9,
			'timeline',
			0x1b,
			null,
			resolveSpeedEditorGrid(0, 9, { column: 8.5, columnSpan: 1.5 }),
		),

		createBasicButtonDefinition(1, 0, 'close-up', 0x04, 0x00, resolveSpeedEditorGrid(1, 0)),
		createBasicButtonDefinition(1, 1, 'place-on-top', 0x05, null, resolveSpeedEditorGrid(1, 1)),
		createBasicButtonDefinition(1, 2, 'src-owr', 0x06, null, resolveSpeedEditorGrid(1, 2)),
		createBasicButtonDefinition(1, 3, 'trans', 0x22, 0x04, resolveSpeedEditorGrid(1, 3)),
		createBasicButtonDefinition(1, 4, 'split', 0x2f, null, resolveSpeedEditorGrid(1, 4)),
		createBasicButtonDefinition(1, 5, 'snap', 0x2e, 0x05, resolveSpeedEditorGrid(1, 5)),
		createBasicButtonDefinition(1, 6, 'ripl-del', 0x2b, null, resolveSpeedEditorGrid(1, 6)),
		createBasicButtonDefinition(1, 7, 'jog-shtl', 0x1c, -2, resolveSpeedEditorGrid(1, 7)), // this negative is a hack, to differentiate them to the special command
		createBasicButtonDefinition(1, 8, 'jog-jog', 0x1d, -1, resolveSpeedEditorGrid(1, 8)), // this negative is a hack, to differentiate them to the special command
		createBasicButtonDefinition(1, 9, 'jog-scrl', 0x1e, -3, resolveSpeedEditorGrid(1, 9)), // this negative is a hack, to differentiate them to the special command

		// In and out are wider keys, sharing the three columns above them
		createBasicButtonDefinition(2, 0, 'in', 0x07, null, resolveSpeedEditorGrid(2, 0, { columnSpan: 1.5 })),
		createBasicButtonDefinition(
			2,
			2,
			'out',
			0x08,
			null,
			resolveSpeedEditorGrid(2, 2, { column: 1.5, columnSpan: 1.5 }),
		),
		createBasicButtonDefinition(2, 3, 'cam7', 0x39, 0x06, resolveSpeedEditorGrid(2, 3)),
		createBasicButtonDefinition(2, 4, 'cam8', 0x3a, 0x07, resolveSpeedEditorGrid(2, 4)),
		createBasicButtonDefinition(2, 5, 'cam9', 0x3b, 0x08, resolveSpeedEditorGrid(2, 5)),
		createBasicButtonDefinition(2, 6, 'live-owr', 0x30, 0x09, resolveSpeedEditorGrid(2, 6)),

		createBasicButtonDefinition(3, 0, 'trim-in', 0x09, null, resolveSpeedEditorGrid(3, 0)),
		createBasicButtonDefinition(3, 1, 'trim-out', 0x0a, null, resolveSpeedEditorGrid(3, 1)),
		createBasicButtonDefinition(3, 2, 'roll', 0x0b, null, resolveSpeedEditorGrid(3, 2)),
		createBasicButtonDefinition(3, 3, 'cam4', 0x36, 0x0a, resolveSpeedEditorGrid(3, 3)),
		createBasicButtonDefinition(3, 4, 'cam5', 0x37, 0x0b, resolveSpeedEditorGrid(3, 4)),
		createBasicButtonDefinition(3, 5, 'cam6', 0x38, 0x0c, resolveSpeedEditorGrid(3, 5)),
		createBasicButtonDefinition(3, 6, 'video-only', 0x25, 0x0d, resolveSpeedEditorGrid(3, 6)),

		createBasicButtonDefinition(4, 0, 'slip-src', 0x0c, null, resolveSpeedEditorGrid(4, 0)),
		createBasicButtonDefinition(4, 1, 'slip-dest', 0x0d, null, resolveSpeedEditorGrid(4, 1)),
		createBasicButtonDefinition(4, 2, 'trans-dur', 0x0e, null, resolveSpeedEditorGrid(4, 2)),
		createBasicButtonDefinition(4, 3, 'cam1', 0x33, 0x0e, resolveSpeedEditorGrid(4, 3)),
		createBasicButtonDefinition(4, 4, 'cam2', 0x34, 0x0f, resolveSpeedEditorGrid(4, 4)),
		createBasicButtonDefinition(4, 5, 'cam3', 0x35, 0x10, resolveSpeedEditorGrid(4, 5)),
		createBasicButtonDefinition(4, 6, 'audio-only', 0x26, 0x11, resolveSpeedEditorGrid(4, 6)),

		createBasicButtonDefinition(5, 0, 'cut', 0x0f, 0x01, resolveSpeedEditorGrid(5, 0)),
		createBasicButtonDefinition(5, 1, 'dis', 0x10, 0x02, resolveSpeedEditorGrid(5, 1)),
		createBasicButtonDefinition(5, 2, 'smth-cut', 0x11, 0x03, resolveSpeedEditorGrid(5, 2)),
		// Stop/play is a wide key, spanning the camera keys above it
		createBasicButtonDefinition(5, 3, 'stop-play', 0x3c, null, resolveSpeedEditorGrid(5, 3, { columnSpan: 4 })),

		{
			type: 'jog',
			id: 0,
			row: 2,
			column: 7,
			columnSpan: 3,
			rowSpan: 4,
			bounds: resolveSpeedEditorGrid(2, 7, { columnSpan: 3, rowSpan: 4 }),
		},
	]),

	faceSize: { width: 245, height: 156 },

	hasBattery: true,
}
