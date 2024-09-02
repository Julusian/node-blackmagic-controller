import type {
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerTBarControlDefinition,
} from '../../controlDefinition.js'

export interface BlackmagicControllerLedService {
	setControlColors(values: BlackmagicControllerLedServiceValue[]): Promise<void>

	clearPanel(): Promise<void>
}

export interface BlackmagicControllerLedServiceValueButton {
	type: 'button'
	control: BlackmagicControllerButtonControlDefinition

	red: boolean
	green: boolean
	blue: boolean
}
export interface BlackmagicControllerLedServiceValueTBar {
	type: 'tbar'
	control: BlackmagicControllerTBarControlDefinition

	leds: boolean[]
}

export type BlackmagicControllerLedServiceValue =
	| BlackmagicControllerLedServiceValueButton
	| BlackmagicControllerLedServiceValueTBar
