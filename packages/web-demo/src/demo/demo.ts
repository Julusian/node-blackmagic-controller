import type { KeyId, BlackmagicControllerWeb } from '@blackmagic-controller/web'

export interface Demo {
	start(device: BlackmagicControllerWeb): Promise<void>
	stop(device: BlackmagicControllerWeb): Promise<void>

	keyDown(device: BlackmagicControllerWeb, keyId: KeyId): Promise<void>
	keyUp(device: BlackmagicControllerWeb, keyId: KeyId): Promise<void>
}
