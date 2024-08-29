import type { BlackmagicPanelControlDefinition } from './controlDefinition.js'

export function freezeDefinitions(
	controls: BlackmagicPanelControlDefinition[],
): Readonly<BlackmagicPanelControlDefinition[]> {
	return Object.freeze(controls.map((control) => Object.freeze(control)))
}

export function createRgbButtonDefinition(
	row: number,
	column: number,
	id: string,
	encodedIndex: number,
): BlackmagicPanelControlDefinition {
	return {
		type: 'button',
		row,
		column,
		id,
		encodedIndex,
		feedbackType: 'rgb',
	}
}
