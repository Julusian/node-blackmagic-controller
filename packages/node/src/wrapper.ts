import type { BlackmagicPanel } from '@elgato-stream-deck/core'
import { BlackmagicPanelProxy } from '@elgato-stream-deck/core'

export class BlackmagicPanelNode extends BlackmagicPanelProxy {
	constructor(
		device: StreamDeck,
		private readonly clearOnClose: boolean,
	) {
		super(device)
	}

	public async close(): Promise<void> {
		if (this.clearOnClose) {
			await this.clearPanel()
		}
		await super.close()
	}
}
