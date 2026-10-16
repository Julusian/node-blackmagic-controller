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

/**
 * Describes a grid of evenly pitched controls on the face of a device, used to estimate the bounds of each control
 */
export interface GridLayout {
	/** Position of the left edge of column 0 */
	left: number
	/** Position of the top edge of row 0 */
	top: number
	/** Distance from the start of one column to the start of the next */
	columnPitch: number
	/** Distance from the start of one row to the start of the next */
	rowPitch: number
	/** The space between two adjacent controls */
	gap: number
	/** Extra space inserted before a column, to separate the sections of a panel. Keyed by column */
	columnBreaks?: Record<number, number>
	/** Extra space inserted before a row, to separate the sections of a panel. Keyed by row */
	rowBreaks?: Record<number, number>
}

/** Sum the breaks which match the filter */
function sumBreaks(breaks: Record<number, number> | undefined, filter: (index: number) => boolean): number {
	let total = 0
	for (const [index, size] of Object.entries(breaks ?? {})) {
		if (filter(Number(index))) total += size
	}
	return total
}

function round(value: number): number {
	return Math.round(value * 10) / 10
}

/**
 * Calculate the bounds of a control within a grid.
 * The column and row may be fractional, for controls which are offset by part of a column
 */
export function gridBounds(
	layout: GridLayout,
	column: number,
	row: number,
	columnSpan = 1,
	rowSpan = 1,
): BlackmagicControllerControlBounds {
	// A break before the control moves it, and a break within its span widens it
	return {
		x: round(layout.left + column * layout.columnPitch + sumBreaks(layout.columnBreaks, (i) => i <= column)),
		y: round(layout.top + row * layout.rowPitch + sumBreaks(layout.rowBreaks, (i) => i <= row)),
		width: round(
			columnSpan * layout.columnPitch -
				layout.gap +
				sumBreaks(layout.columnBreaks, (i) => i > column && i < column + columnSpan),
		),
		height: round(
			rowSpan * layout.rowPitch - layout.gap + sumBreaks(layout.rowBreaks, (i) => i > row && i < row + rowSpan),
		),
	}
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
