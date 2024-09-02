import type { BlackmagicController } from '@blackmagic-controller/web'
import type { Demo } from './demo.js'

export class FillWhenPressedDemo implements Demo {
	private pressed = new Set<string>()

	public async start(device: BlackmagicController): Promise<void> {
		this.pressed.clear()
		await device.clearPanel()
	}
	public async stop(device: BlackmagicController): Promise<void> {
		this.pressed.clear()
		await device.clearPanel()
	}
	public async keyDown(device: BlackmagicController, keyId: string): Promise<void> {
		if (this.pressed.has(keyId)) return
		this.pressed.add(keyId)

		await device.setButtonColor(keyId, true, false, false)
	}
	public async keyUp(device: BlackmagicController, keyId: string): Promise<void> {
		if (!this.pressed.has(keyId)) return
		this.pressed.delete(keyId)

		await device.clearKey(keyId)
	}
}
