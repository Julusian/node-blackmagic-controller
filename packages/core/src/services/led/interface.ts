import type { BlackmagicPanelButtonControlDefinition } from '../../controlDefinition'

export interface BlackmagicPanelLedService {
	setButtonColor(control: BlackmagicPanelButtonControlDefinition, r: boolean, g: boolean, b: boolean): Promise<void>

	clearPanel(): Promise<void>
}
