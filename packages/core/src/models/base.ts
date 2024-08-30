import { EventEmitter } from 'eventemitter3'
import type { HIDDevice, HIDDeviceInfo } from '../hid-device.js'
import type { DeviceModelId, KeyId } from '../id.js'
import type {
	BlackmagicController,
	BlackmagicControllerEvents,
	BlackmagicControllerSetButtonColorValue,
} from '../types.js'
import type {
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerControlDefinition,
	BlackmagicControllerTBarControlDefinition,
} from '../controlDefinition.js'
import type { PropertiesService } from '../services/properties/interface.js'
import type { CallbackHook } from '../services/callback-hook.js'
import type { BlackmagicControllerInputService } from '../services/input/interface.js'
import { BlackmagicControllerLedService, BlackmagicControllerLedServiceValue } from '../services/led/interface.js'

export type EncodeJPEGHelper = (buffer: Uint8Array, width: number, height: number) => Promise<Uint8Array>

export interface OpenBlackmagicControllerOptions {
	// For future use
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
	readonly #propertiesService: PropertiesService
	readonly #inputService: BlackmagicControllerInputService
	readonly #ledService: BlackmagicControllerLedService
	// private readonly options: Readonly<OpenBlackmagicControllerOptions>

	constructor(
		device: HIDDevice,
		_options: OpenBlackmagicControllerOptions,
		services: BlackmagicControllerServicesDefinition,
	) {
		super()

		this.device = device
		this.deviceProperties = services.deviceProperties
		this.#propertiesService = services.properties
		this.#inputService = services.inputService
		this.#ledService = services.led

		// propogate events
		services.events?.listen((key, ...args) => this.emit(key, ...args))

		this.device.on('input', (data: Uint8Array) => this.#inputService.handleInput(data))

		this.device.on('error', (err) => {
			this.emit('error', err)
		})
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
			throw new TypeError(`Expected a valid keyIndex`)
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
			throw new TypeError(`Expected a valid keyIndex`)
		}

		return tbarControl
	}

	public async close(): Promise<void> {
		return this.device.close()
	}

	public async getHidDeviceInfo(): Promise<HIDDeviceInfo> {
		return this.device.getDeviceInfo()
	}

	public async getBatteryLevel(): Promise<number | null> {
		return this.#propertiesService.getBatteryLevel()
	}

	// public async setBrightness(percentage: number): Promise<void> {
	// 	return this.#propertiesService.setBrightness(percentage)
	// }

	public async getFirmwareVersion(): Promise<string> {
		return this.#propertiesService.getFirmwareVersion()
	}
	public async getSerialNumber(): Promise<string> {
		return this.#propertiesService.getSerialNumber()
	}

	public async setButtonColor(keyId: KeyId, red: boolean, green: boolean, blue: boolean): Promise<void> {
		const control = this.checkValidKeyId(keyId, 'rgb')

		await this.#ledService.setControlColors([{ type: 'button', control, red, green, blue }])
	}

	public async setButtonColors(values: BlackmagicControllerSetButtonColorValue[]): Promise<void> {
		const translated: BlackmagicControllerLedServiceValue[] = values.map((value) => {
			// TODO - avoid iterating over all controls inside `checkValidKeyId`

			return {
				...value,
				type: 'button',
				control: this.checkValidKeyId(value.keyId, 'rgb'),
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
		const control = this.checkValidKeyId(keyId, 'rgb')

		await this.#ledService.setControlColors([{ type: 'button', control, red: false, green: false, blue: false }])
	}

	public async clearPanel(): Promise<void> {
		await this.#ledService.clearPanel()
	}
}
