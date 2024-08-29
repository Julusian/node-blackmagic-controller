import type { EventEmitter } from 'eventemitter3'
import type { DeviceModelId, KeyId } from './id.js'
import type { HIDDeviceInfo } from './hid-device.js'
import type { BlackmagicPanelButtonControlDefinition, BlackmagicPanelControlDefinition } from './controlDefinition.js'

export type BlackmagicPanelEvents = {
	tbar: [control: BlackmagicPanelButtonControlDefinition, percent: number]
	down: [control: BlackmagicPanelButtonControlDefinition]
	up: [control: BlackmagicPanelButtonControlDefinition]
	error: [err: unknown]
	batteryLevel: [percent: number]
}

export interface BlackmagicPanel extends EventEmitter<BlackmagicPanelEvents> {
	/** List of the controls on this panel */
	readonly CONTROLS: Readonly<BlackmagicPanelControlDefinition[]>

	/** The model of this device */
	readonly MODEL: DeviceModelId
	/** The name of the product/model */
	readonly PRODUCT_NAME: string

	/**
	 * Close the device
	 */
	close(): Promise<void>

	/**
	 * Get information about the underlying HID device
	 */
	getHidDeviceInfo(): Promise<HIDDeviceInfo>

	/**
	 * Fills the given key with a solid color.
	 *
	 * @param {number} keyIndex The key to fill
	 * @param {number} r The color's red value. 0 - 255
	 * @param {number} g The color's green value. 0 - 255
	 * @param {number} b The color's blue value. 0 -255
	 */
	setKeyColor(keyIndex: KeyId, r: boolean, g: boolean, b: boolean): Promise<void>

	/**
	 * Clears the given key.
	 *
	 * @param {number} keyIndex The key to clear
	 */
	clearKey(keyIndex: KeyId): Promise<void>

	/**
	 * Clears all keys.
	 */
	clearPanel(): Promise<void>

	// /**
	//  * Sets the brightness of the keys on the Stream Deck
	//  *
	//  * @param {number} percentage The percentage brightness
	//  */
	// setBrightness(percentage: number): Promise<void>

	/**
	 * Get firmware version from Stream Deck
	 */
	getFirmwareVersion(): Promise<string>

	/**
	 * Get serial number from Stream Deck
	 */
	getSerialNumber(): Promise<string>
}
