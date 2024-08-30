import { KeyId } from './id'

export interface BlackmagicControllerControlDefinitionBase {
	type: 'button' | 'tbar'

	row: number
	column: number
}

export interface BlackmagicControllerButtonControlDefinition extends BlackmagicControllerControlDefinitionBase {
	type: 'button'

	id: KeyId
	encodedIndex: number

	feedbackType: 'rgb'
}

export interface BlackmagicControllerTBarControlDefinition extends BlackmagicControllerControlDefinitionBase {
	type: 'tbar'
	id: 0 // Future: Maybe there will be more than one LCD segment

	columnSpan: number
	rowSpan: number

	ledSegments: number
}

export type BlackmagicControllerControlDefinition =
	| BlackmagicControllerButtonControlDefinition
	| BlackmagicControllerTBarControlDefinition
