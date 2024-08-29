import { EventEmitter } from 'eventemitter3'
import type { HIDDevice, HIDDeviceInfo } from '../hid-device.js'
import type { DeviceModelId, KeyId } from '../id.js'
import type { BlackmagicPanel, BlackmagicPanelEvents } from '../types.js'
import type { BlackmagicPanelButtonControlDefinition, BlackmagicPanelControlDefinition } from '../controlDefinition.js'
import type { PropertiesService } from '../services/properties/interface.js'
import type { CallbackHook } from '../services/callback-hook.js'
import type { BlackmagicPanelInputService } from '../services/input/interface.js'
import { BlackmagicPanelLedService } from '../services/led/interface.js'

export type EncodeJPEGHelper = (buffer: Uint8Array, width: number, height: number) => Promise<Uint8Array>

export interface OpenBlackmagicPanelOptions {
	// For future use
}

export type BlackmagicPanelProperties = Readonly<{
	MODEL: DeviceModelId
	PRODUCT_NAME: string

	CONTROLS: Readonly<BlackmagicPanelControlDefinition[]>
}>

export interface BlackmagicPanelServicesDefinition {
	deviceProperties: BlackmagicPanelProperties
	events: CallbackHook<BlackmagicPanelEvents>
	properties: PropertiesService
	inputService: BlackmagicPanelInputService
	led: BlackmagicPanelLedService
}

export class BlackmagicPanelBase extends EventEmitter<BlackmagicPanelEvents> implements BlackmagicPanel {
	get CONTROLS(): Readonly<BlackmagicPanelControlDefinition[]> {
		return this.deviceProperties.CONTROLS
	}

	get MODEL(): DeviceModelId {
		return this.deviceProperties.MODEL
	}
	get PRODUCT_NAME(): string {
		return this.deviceProperties.PRODUCT_NAME
	}

	protected readonly device: HIDDevice
	protected readonly deviceProperties: Readonly<BlackmagicPanelProperties>
	readonly #propertiesService: PropertiesService
	readonly #inputService: BlackmagicPanelInputService
	readonly #ledService: BlackmagicPanelLedService
	// private readonly options: Readonly<OpenBlackmagicPanelOptions>

	constructor(device: HIDDevice, _options: OpenBlackmagicPanelOptions, services: BlackmagicPanelServicesDefinition) {
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
		feedbackType: BlackmagicPanelButtonControlDefinition['feedbackType'] | null,
	): BlackmagicPanelButtonControlDefinition {
		const buttonControl = this.deviceProperties.CONTROLS.find(
			(control): control is BlackmagicPanelButtonControlDefinition =>
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

	public async close(): Promise<void> {
		return this.device.close()
	}

	public async getHidDeviceInfo(): Promise<HIDDeviceInfo> {
		return this.device.getDeviceInfo()
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

	public async setButtonColor(keyId: KeyId, r: boolean, g: boolean, b: boolean): Promise<void> {
		const control = this.checkValidKeyId(keyId, 'rgb')

		await this.#ledService.setButtonColor(control, r, g, b)
	}

	public async clearKey(keyId: KeyId): Promise<void> {
		const control = this.checkValidKeyId(keyId, 'rgb')

		await this.#ledService.setButtonColor(control, false, false, false)
	}

	public async clearPanel(): Promise<void> {
		await this.#ledService.clearPanel()
	}
}
