import type { BlackmagicController } from '@blackmagic-controller/core'
import { BlackmagicControllerProxy } from '@blackmagic-controller/core'
import type { WebHIDDevice } from './hid-device.js'

/**
 * A BlackmagicController instance.
 * This is an extended variant of the class, to provide some more web friendly helpers, such as accepting a canvas
 */
export class BlackmagicControllerWeb extends BlackmagicControllerProxy {
	private readonly hid: WebHIDDevice

	constructor(device: BlackmagicController, hid: WebHIDDevice) {
		super(device)
		this.hid = hid
	}

	/**
	 * Instruct the browser to close and forget the device. This will revoke the website's permissions to access the device.
	 */
	public async forget(): Promise<void> {
		await this.hid.forget()
	}
}
