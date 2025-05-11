import type {
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerTBarControlDefinition,
} from '../../controlDefinition.js'

export interface BlackmagicControllerLedService {
	setControlColors(values: BlackmagicControllerLedServiceValue[]): Uint8Array[]

	clearPanel(): Uint8Array[]
}

export interface BlackmagicControllerLedServiceValueButtonRgb {
	type: 'button-rgb'
	control: BlackmagicControllerButtonControlDefinition

	red: boolean
	green: boolean
	blue: boolean
}
export interface BlackmagicControllerLedServiceValueButtonOnOff {
	type: 'button-on-off'
	control: BlackmagicControllerButtonControlDefinition

	on: boolean
}
export interface BlackmagicControllerLedServiceValueTBar {
	type: 'tbar'
	control: BlackmagicControllerTBarControlDefinition

	leds: boolean[]
}

export type BlackmagicControllerLedServiceValue =
	| BlackmagicControllerLedServiceValueButtonRgb
	| BlackmagicControllerLedServiceValueButtonOnOff
	| BlackmagicControllerLedServiceValueTBar
