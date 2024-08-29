import type { BlackmagicPanelControlDefinition } from './controlDefinition.js'

export function freezeDefinitions(
	controls: BlackmagicPanelControlDefinition[],
): Readonly<BlackmagicPanelControlDefinition[]> {
	return Object.freeze(controls.map((control) => Object.freeze(control)))
}
