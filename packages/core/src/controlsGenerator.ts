import type { BlackmagicControllerControlDefinition } from './controlDefinition.js'

export function freezeDefinitions(
	controls: BlackmagicControllerControlDefinition[],
): Readonly<BlackmagicControllerControlDefinition[]> {
	return Object.freeze(controls.map((control) => Object.freeze(control)))
}

export function createRgbButtonDefinition(
	row: number,
	column: number,
	id: string,
	encodedIndex: number,
	ledBitIndex: number,
): BlackmagicControllerControlDefinition {
	return {
		type: 'button',
		row,
		column,
		id,
		encodedIndex,
		feedbackType: 'rgb',
		ledBitIndex,
	}
}

export function createBasicButtonDefinition(
	row: number,
	column: number,
	id: string,
	encodedIndex: number,
	ledBitIndex: number | null,
): BlackmagicControllerControlDefinition {
	return {
		type: 'button',
		row,
		column,
		id,
		encodedIndex,
		feedbackType: ledBitIndex != null ? 'on-off' : 'none',
		ledBitIndex: ledBitIndex ?? 0,
	}
}
