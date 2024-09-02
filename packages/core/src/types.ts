import type { EventEmitter } from 'eventemitter3'
import type { DeviceModelId, KeyId } from './id.js'
import type { HIDDeviceInfo } from './hid-device.js'
import type {
	BlackmagicControllerButtonControlDefinition,
	BlackmagicControllerControlDefinition,
	BlackmagicControllerTBarControlDefinition,
} from './controlDefinition.js'

export type BlackmagicControllerEvents = {
	down: [control: BlackmagicControllerButtonControlDefinition]
	up: [control: BlackmagicControllerButtonControlDefinition]
	tbar: [control: BlackmagicControllerTBarControlDefinition, percent: number]
	batteryLevel: [percent: number]
	error: [err: unknown]
}

export interface BlackmagicController extends EventEmitter<BlackmagicControllerEvents> {
	/** List of the controls on this controller */
	readonly CONTROLS: Readonly<BlackmagicControllerControlDefinition[]>

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
	 * Get the current battery level of the controller, if supported
	 */
	getBatteryLevel(): Promise<number | null>

	/**
	 * Fills the given key with a solid color.
	 *
	 * @param {number} keyIndex The key to fill
	 * @param {number} r The color's red value. 0 - 255
	 * @param {number} g The color's green value. 0 - 255
	 * @param {number} b The color's blue value. 0 -255
	 */
	setButtonColor(keyIndex: KeyId, r: boolean, g: boolean, b: boolean): Promise<void>

	/**
	 * Fill multiple keys with colors.
	 * @param values Keys and colors to set
	 */
	setButtonColors(values: BlackmagicControllerSetButtonColorValue[]): Promise<void>

	/**
	 * Set the state of the T-Bar LEDs
	 * @param leds Led states
	 */
	setTbarLeds(leds: boolean[]): Promise<void>

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

	/**
	 * Get firmware version of the controller
	 */
	getFirmwareVersion(): Promise<string>

	/**
	 * Get serial number of the controller
	 */
	getSerialNumber(): Promise<string>
}

export interface BlackmagicControllerSetButtonColorValue {
	keyId: KeyId
	red: boolean
	green: boolean
	blue: boolean
}
