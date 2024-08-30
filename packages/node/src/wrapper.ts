import type { BlackmagicController } from '@blackmagic-controller/core'
import { BlackmagicControllerProxy } from '@blackmagic-controller/core'

export class BlackmagicControllerNode extends BlackmagicControllerProxy {
	constructor(
		device: BlackmagicController,
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
