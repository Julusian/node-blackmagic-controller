import { EventEmitter } from 'eventemitter3'
import type { HIDDevice, HIDDeviceInfo } from '../hid-device.js'
import type { DeviceModelId, KeyIndex } from '../id.js'
import type { BlackmagicPanel, BlackmagicPanelEvents } from '../types.js'
import type { BlackmagicPanelButtonControlDefinition, BlackmagicPanelControlDefinition } from '../controlDefinition.js'
import type { PropertiesService } from '../services/properties/interface.js'
import type { CallbackHook } from '../services/callback-hook.js'
import type { StreamDeckInputService } from '../services/input/interface.js'

export type EncodeJPEGHelper = (buffer: Uint8Array, width: number, height: number) => Promise<Uint8Array>

export interface OpenBlackmagicPanelOptions {
	// For future use
}

export type StreamDeckProperties = Readonly<{
	MODEL: DeviceModelId
	PRODUCT_NAME: string

	CONTROLS: Readonly<BlackmagicPanelControlDefinition[]>
}>

export interface StreamDeckServicesDefinition {
	deviceProperties: StreamDeckProperties
	events: CallbackHook<BlackmagicPanelEvents>
	properties: PropertiesService
	inputService: StreamDeckInputService
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
	protected readonly deviceProperties: Readonly<StreamDeckProperties>
	readonly #propertiesService: PropertiesService
	readonly #inputService: StreamDeckInputService
	// private readonly options: Readonly<OpenStreamDeckOptions>

	constructor(device: HIDDevice, _options: OpenBlackmagicPanelOptions, services: StreamDeckServicesDefinition) {
		super()

		this.device = device
		this.deviceProperties = services.deviceProperties
		this.#propertiesService = services.properties
		this.#inputService = services.inputService

		// propogate events
		services.events?.listen((key, ...args) => this.emit(key, ...args))

		this.device.on('input', (data: Uint8Array) => this.#inputService.handleInput(data))

		this.device.on('error', (err) => {
			this.emit('error', err)
		})
	}

	protected checkValidKeyIndex(
		keyIndex: KeyIndex,
		feedbackType: BlackmagicPanelButtonControlDefinition['feedbackType'] | null,
	): void {
		const buttonControl = this.deviceProperties.CONTROLS.find(
			(control): control is BlackmagicPanelButtonControlDefinition =>
				control.type === 'button' && control.index === keyIndex,
		)

		if (!buttonControl) {
			throw new TypeError(`Expected a valid keyIndex`)
		}

		if (feedbackType && buttonControl.feedbackType !== feedbackType) {
			throw new TypeError(`Expected a keyIndex with expected feedbackType`)
		}
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

	public async setKeyColor(keyIndex: KeyIndex, r: number, g: number, b: number): Promise<void> {
		this.checkValidKeyIndex(keyIndex, null)

		await this.#buttonsLcdService.fillKeyColor(keyIndex, r, g, b)
	}

	public async clearKey(keyIndex: KeyIndex): Promise<void> {
		this.checkValidKeyIndex(keyIndex, null)

		await this.#buttonsLcdService.clearKey(keyIndex)
	}

	public async clearPanel(): Promise<void> {
		const ps: Array<Promise<void>> = []

		ps.push(this.#buttonsLcdService.clearPanel())

		if (this.#lcdSegmentDisplayService) ps.push(this.#lcdSegmentDisplayService.clearAllLcdSegments())

		await Promise.all(ps)
	}
}
