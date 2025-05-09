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
}

export interface BlackmagicControllerTBarControlDefinition extends BlackmagicControllerControlDefinitionBase {
	type: 'tbar'
	id: 0 // Future: Maybe there will be more than one TBar

	columnSpan: number
	rowSpan: number

	ledSegments: number
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
