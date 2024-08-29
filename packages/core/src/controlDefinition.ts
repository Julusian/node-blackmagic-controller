export interface BlackmagicPanelControlDefinitionBase {
	type: 'button' | 'tbar'

	row: number
	column: number
}

export interface BlackmagicPanelButtonControlDefinition extends BlackmagicPanelControlDefinitionBase {
	type: 'button'

	index: number
	hidIndex: number

	feedbackType: 'rgb'
}

export interface BlackmagicPanelTBarControlDefinition extends BlackmagicPanelControlDefinitionBase {
	type: 'tbar'
	id: 0 // Future: Maybe there will be more than one LCD segment

	columnSpan: number
	rowSpan: number
}

export type BlackmagicPanelControlDefinition =
	| BlackmagicPanelButtonControlDefinition
	| BlackmagicPanelTBarControlDefinition
