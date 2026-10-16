import type { BlackmagicControllerControlBounds, BlackmagicControllerControlDefinition } from './controlDefinition.js'

export function freezeDefinitions(
	controls: BlackmagicControllerControlDefinition[],
): Readonly<BlackmagicControllerControlDefinition[]> {
	const seenIds = new Set<string>()
	for (const control of controls) {
		const id = `${control.type}:${control.id}`
		if (seenIds.has(id)) {
			throw new Error(`Duplicate control id "${id}"`)
		}
		seenIds.add(id)
	}

	return Object.freeze(
		controls.map((control) => Object.freeze({ ...control, bounds: Object.freeze({ ...control.bounds }) })),
	)
}

export function createRgbButtonDefinition(
	row: number,
	column: number,
	id: string,
	encodedIndex: number,
	ledBitIndex: number,
	bounds: BlackmagicControllerControlBounds,
): BlackmagicControllerControlDefinition {
	return {
		type: 'button',
		row,
		column,
		bounds,
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
	bounds: BlackmagicControllerControlBounds,
): BlackmagicControllerControlDefinition {
	return {
		type: 'button',
		row,
		column,
		bounds,
		id,
		encodedIndex,
		feedbackType: ledBitIndex != null ? 'on-off' : 'none',
		ledBitIndex: ledBitIndex ?? 0,
	}
}
