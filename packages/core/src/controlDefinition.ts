import { KeyId } from './id'

export interface BlackmagicPanelControlDefinitionBase {
	type: 'button' | 'tbar'

	row: number
	column: number
}

export interface BlackmagicPanelButtonControlDefinition extends BlackmagicPanelControlDefinitionBase {
	type: 'button'

	id: KeyId
	encodedIndex: number

	feedbackType: 'rgb'
}

export interface BlackmagicPanelTBarControlDefinition extends BlackmagicPanelControlDefinitionBase {
	type: 'tbar'
	id: 0 // Future: Maybe there will be more than one LCD segment

	columnSpan: number
	rowSpan: number

	ledSegments: number
}

export type BlackmagicPanelControlDefinition =
	| BlackmagicPanelButtonControlDefinition
	| BlackmagicPanelTBarControlDefinition
