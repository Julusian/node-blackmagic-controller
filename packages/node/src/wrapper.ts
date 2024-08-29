import type { BlackmagicPanel } from '@blackmagic-panel/core'
import { BlackmagicPanelProxy } from '@blackmagic-panel/core'

export class BlackmagicPanelNode extends BlackmagicPanelProxy {
	constructor(
		device: BlackmagicPanel,
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
