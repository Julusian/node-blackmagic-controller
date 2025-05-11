import { EventEmitter } from 'eventemitter3'
import type { HIDDevice, HIDDeviceInfo } from '../hid-device.js'
import type { DeviceModelId, KeyId } from '../id.js'
import type {
	BlackmagicController,
	BlackmagicControllerEvents,
	BlackmagicControllerSetButtonSomeValue,
} from '../types.js'
import type {
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerControlDefinition,
	BlackmagicControllerTBarControlDefinition,
} from '../controlDefinition.js'
import type { PropertiesService } from '../services/properties/interface.js'
import type { CallbackHook } from '../services/callback-hook.js'
import type { BlackmagicControllerInputService } from '../services/input/interface.js'
import type { BlackmagicControllerLedService, BlackmagicControllerLedServiceValue } from '../services/led/interface.js'

export type EncodeJPEGHelper = (buffer: Uint8Array, width: number, height: number) => Promise<Uint8Array>

export type OpenBlackmagicControllerOptions = Record<string, never> // For future use

export interface OpenBlackmagicControllerOptionsInternal /*extends OpenBlackmagicControllerOptions*/ {
	nextAuthMaxDelay: number | null
	authenticate: ((device: HIDDevice) => Promise<number>) | null
}

export type BlackmagicControllerProperties = Readonly<{
	MODEL: DeviceModelId
	PRODUCT_NAME: string

	CONTROLS: Readonly<BlackmagicControllerControlDefinition[]>
}>

export interface BlackmagicControllerServicesDefinition {
	deviceProperties: BlackmagicControllerProperties
	events: CallbackHook<BlackmagicControllerEvents>
	properties: PropertiesService
	inputService: BlackmagicControllerInputService
	led: BlackmagicControllerLedService
}

export class BlackmagicControllerBase extends EventEmitter<BlackmagicControllerEvents> implements BlackmagicController {
	get CONTROLS(): Readonly<BlackmagicControllerControlDefinition[]> {
		return this.deviceProperties.CONTROLS
	}

	get MODEL(): DeviceModelId {
		return this.deviceProperties.MODEL
	}
	get PRODUCT_NAME(): string {
		return this.deviceProperties.PRODUCT_NAME
	}

	protected readonly device: HIDDevice
	protected readonly deviceProperties: Readonly<BlackmagicControllerProperties>
	readonly #options: Readonly<OpenBlackmagicControllerOptionsInternal>
	readonly #propertiesService: PropertiesService
	readonly #inputService: BlackmagicControllerInputService
	readonly #ledService: BlackmagicControllerLedService

	#authTimeout: NodeJS.Timeout | null = null

	constructor(
		device: HIDDevice,
		options: OpenBlackmagicControllerOptionsInternal,
		services: BlackmagicControllerServicesDefinition,
	) {
		super()

		this.device = device
		this.deviceProperties = services.deviceProperties
		this.#options = options
		this.#propertiesService = services.properties
		this.#inputService = services.inputService
		this.#ledService = services.led

		// propogate events
		services.events?.listen((key, ...args) => this.emit(key, ...args))

		this.device.on('input', (data: Uint8Array) => this.#inputService.handleInput(data))

		this.device.on('error', (err) => {
			// This means the device has failed, and can be treated as 'closed'
			if (this.#authTimeout) clearTimeout(this.#authTimeout)

			this.emit('error', err)
		})

		this.#scheduleNextAuthenticate(this.#options.nextAuthMaxDelay || 600, 1)
	}

	#scheduleNextAuthenticate(maxDelay: number, attempt: number): void {
		const authenticateFn = this.#options.authenticate
		if (!authenticateFn) return

		if (this.#authTimeout) clearTimeout(this.#authTimeout)

		const targetWait = maxDelay * 0.5 * 1000 // Do it halfway through the timeout

		this.#authTimeout = setTimeout(() => {
			authenticateFn(this.device)
				.then((nextDelay) => {
					this.#scheduleNextAuthenticate(nextDelay, 1)
				})
				.catch((err) => {
					if (attempt < 3) {
						this.#scheduleNextAuthenticate(15, attempt + 1) // Retry soon, in case it was a temporary failure
					} else {
						this.emit('error', new Error('Failed to authenticate', { cause: err }))
					}
				})
		}, targetWait)
	}

	protected checkValidKeyId(
		keyId: KeyId,
		feedbackType: BlackmagicControllerButtonControlDefinition['feedbackType'] | null,
	): BlackmagicControllerButtonControlDefinition {
		const buttonControl = this.deviceProperties.CONTROLS.find(
			(control): control is BlackmagicControllerButtonControlDefinition =>
				control.type === 'button' && control.id === keyId,
		)

		if (!buttonControl) {
			throw new TypeError(`Expected a valid keyId`)
		}

		if (feedbackType && buttonControl.feedbackType !== feedbackType) {
			throw new TypeError(`Expected a keyIndex with expected feedbackType`)
		}

		return buttonControl
	}

	protected checkValidTbarIndex(id: number): BlackmagicControllerTBarControlDefinition {
		const tbarControl = this.deviceProperties.CONTROLS.find(
			(control): control is BlackmagicControllerTBarControlDefinition =>
				control.type === 'tbar' && control.id === id,
		)

		if (!tbarControl) {
			throw new TypeError(`Expected a valid tbar index`)
		}

		return tbarControl
	}

	public async close(): Promise<void> {
		if (this.#authTimeout) clearTimeout(this.#authTimeout)

		return this.device.close()
	}

	public async getHidDeviceInfo(): Promise<HIDDeviceInfo> {
		return this.device.getDeviceInfo()
	}

	public async getBatteryLevel(): Promise<number | null> {
		return this.#propertiesService.getBatteryLevel()
	}

	public async getFirmwareVersion(): Promise<string> {
		return this.#propertiesService.getFirmwareVersion()
	}
	public async getSerialNumber(): Promise<string> {
		return this.#propertiesService.getSerialNumber()
	}

	public async setButtonColor(keyId: KeyId, red: boolean, green: boolean, blue: boolean): Promise<void> {
		const control = this.checkValidKeyId(keyId, 'rgb')

		await this.#ledService.setControlColors([{ type: 'button-rgb', control, red, green, blue }])
	}

	public async setButtonOnOff(keyId: KeyId, on: boolean): Promise<void> {
		const control = this.checkValidKeyId(keyId, 'on-off')

		await this.#ledService.setControlColors([{ type: 'button-on-off', control, on }])
	}

	public async setButtonStates(values: BlackmagicControllerSetButtonSomeValue[]): Promise<void> {
		const translated: BlackmagicControllerLedServiceValue[] = values.map((value) => {
			// TODO - avoid iterating over all controls inside `checkValidKeyId`
			const control = this.checkValidKeyId(value.keyId, null)

			switch (control.feedbackType) {
				case 'rgb':
					if (value.type !== 'rgb') {
						throw new TypeError(`Expected a keyId with feedbackType 'rgb'`)
					}
					return {
						...value,
						type: 'button-rgb',
						control: control,
					}
				case 'on-off':
					if (value.type !== 'on-off') {
						throw new TypeError(`Expected a keyId with feedbackType 'on-off'`)
					}
					return {
						...value,
						type: 'button-on-off',
						control: control,
					}
				default:
					throw new TypeError(`Cannot set state of button ${value.keyId}`)
			}
		})

		await this.#ledService.setControlColors(translated)
	}

	public async setTbarLeds(leds: boolean[]): Promise<void> {
		const control = this.checkValidTbarIndex(0)

		if (control.ledSegments <= 0) throw new Error(`TBar does not have leds`)

		if (leds.length !== control.ledSegments) throw new Error(`Expected ${control.ledSegments} led values`)

		await this.#ledService.setControlColors([{ type: 'tbar', control, leds }])
	}

	public async clearKey(keyId: KeyId): Promise<void> {
		const control = this.checkValidKeyId(keyId, null)

		switch (control.feedbackType) {
			case 'rgb':
				await this.#ledService.setControlColors([
					{ type: 'button-rgb', control, red: false, green: false, blue: false },
				])
				break
			case 'on-off':
				await this.#ledService.setControlColors([{ type: 'button-on-off', control, on: false }])
				break
			case 'none':
				// No action needed
				break
			default:
				throw new TypeError(`Cannot clear button ${keyId}`)
		}
	}

	public async clearPanel(): Promise<void> {
		await this.#ledService.clearPanel()
	}
}
