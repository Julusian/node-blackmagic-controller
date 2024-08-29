import type {
	BlackmagicPanelButtonControlDefinition,
	BlackmagicPanelTBarControlDefinition,
} from '../../controlDefinition'

export interface BlackmagicPanelLedService {
	setControlColors(values: BlackmagicPanelLedServiceValue[]): Promise<void>

	clearPanel(): Promise<void>
}

export interface BlackmagicPanelLedServiceValueButton {
	type: 'button'
	control: BlackmagicPanelButtonControlDefinition

	red: boolean
	green: boolean
	blue: boolean
}
export interface BlackmagicPanelLedServiceValueTBar {
	type: 'tbar'
	control: BlackmagicPanelTBarControlDefinition

	leds: boolean[]
}

export type BlackmagicPanelLedServiceValue = BlackmagicPanelLedServiceValueButton | BlackmagicPanelLedServiceValueTBar
