import type { KeyId } from './id.js'

export interface BlackmagicControllerControlDefinitionBase {
	type: 'button' | 'tbar' | 'jog'

	row: number
	column: number
}

export interface BlackmagicControllerButtonControlDefinition extends BlackmagicControllerControlDefinitionBase {
	type: 'button'

	id: KeyId
	encodedIndex: number

	feedbackType: 'rgb' | 'on-off' | 'none'

	/**
	 * This is an internal value, and should not be used outside of the library.
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
	 * This is an internal value, and should not be used outside of the library.
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
