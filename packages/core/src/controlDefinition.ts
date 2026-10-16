import type { KeyId } from './info.js'

/**
 * A rectangle on the face of a device, with the origin at its top left and `y` increasing downwards.
 * Distances are in the units of `BlackmagicControllerModelInfo.faceSize`, which for every current model is millimetres.
 */
export interface BlackmagicControllerControlBounds {
	x: number
	y: number
	width: number
	height: number
}

export interface BlackmagicControllerControlDefinitionBase {
	id: string | number
	type: 'button' | 'tbar' | 'jog'

	row: number
	column: number

	/** Where this control sits on the face, within `BlackmagicControllerModelInfo.faceSize` */
	bounds: BlackmagicControllerControlBounds
}

export interface BlackmagicControllerButtonControlDefinition extends BlackmagicControllerControlDefinitionBase {
	type: 'button'

	id: KeyId
	/** @internal The on wire index of this button */
	encodedIndex: number

	feedbackType: 'rgb' | 'on-off' | 'none'

	/**
	 * @internal
	 * The bit index of the leds in the encoded buffer.
	 */
	ledBitIndex: number
}

export interface BlackmagicControllerTBarControlDefinition extends BlackmagicControllerControlDefinitionBase {
	type: 'tbar'
	id: 0 // Future: Maybe there will be more than one TBar

	columnSpan: number
	rowSpan: number

	ledSegments: number

	/**
	 * @internal
	 * The bit index of the leds in the encoded buffer.
	 */
	ledBitIndex: number
}

export interface BlackmagicControllerJogControlDefinition extends BlackmagicControllerControlDefinitionBase {
	type: 'jog'
	id: 0 // Future: Maybe there will be more than one Jog wheel

	columnSpan: number
	rowSpan: number
}

export type BlackmagicControllerControlDefinition =
	| BlackmagicControllerButtonControlDefinition
	| BlackmagicControllerTBarControlDefinition
	| BlackmagicControllerJogControlDefinition
