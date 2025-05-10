import type { EventEmitter } from 'eventemitter3'
import type { DeviceModelId } from './id.js'
import type { BlackmagicController, BlackmagicControllerEvents } from './types.js'
import type { BlackmagicControllerControlDefinition } from './controlDefinition.js'

/**
 * A minimal proxy around a BlackmagicController instance.
 * This is intended to be used by libraries wrapping this that want to add more methods to the BlackmagicController
 */

export class BlackmagicControllerProxy implements BlackmagicController {
	protected device: BlackmagicController

	constructor(device: BlackmagicController) {
		this.device = device
	}

	public get CONTROLS(): Readonly<BlackmagicControllerControlDefinition[]> {
		return this.device.CONTROLS
	}

	public get MODEL(): DeviceModelId {
		return this.device.MODEL
	}
	public get PRODUCT_NAME(): string {
		return this.device.PRODUCT_NAME
	}

	public async close(): Promise<void> {
		return this.device.close()
	}
	public async getHidDeviceInfo(
		...args: Parameters<BlackmagicController['getHidDeviceInfo']>
	): ReturnType<BlackmagicController['getHidDeviceInfo']> {
		return this.device.getHidDeviceInfo(...args)
	}
	public async setButtonColor(
		...args: Parameters<BlackmagicController['setButtonColor']>
	): ReturnType<BlackmagicController['setButtonColor']> {
		return this.device.setButtonColor(...args)
	}
	public async setButtonOnOff(
		...args: Parameters<BlackmagicController['setButtonOnOff']>
	): ReturnType<BlackmagicController['setButtonOnOff']> {
		return this.device.setButtonOnOff(...args)
	}
	public async setButtonStates(
		...args: Parameters<BlackmagicController['setButtonStates']>
	): ReturnType<BlackmagicController['setButtonStates']> {
		return this.device.setButtonStates(...args)
	}
	public async setTbarLeds(
		...args: Parameters<BlackmagicController['setTbarLeds']>
	): ReturnType<BlackmagicController['setTbarLeds']> {
		return this.device.setTbarLeds(...args)
	}
	public async clearKey(
		...args: Parameters<BlackmagicController['clearKey']>
	): ReturnType<BlackmagicController['clearKey']> {
		return this.device.clearKey(...args)
	}
	public async clearPanel(
		...args: Parameters<BlackmagicController['clearPanel']>
	): ReturnType<BlackmagicController['clearPanel']> {
		return this.device.clearPanel(...args)
	}
	public async getBatteryLevel(): Promise<number | null> {
		return this.device.getBatteryLevel()
	}
	public async getFirmwareVersion(): Promise<string> {
		return this.device.getFirmwareVersion()
	}
	public async getSerialNumber(): Promise<string> {
		return this.device.getSerialNumber()
	}

	/**
	 * EventEmitter
	 */

	public eventNames(): Array<EventEmitter.EventNames<BlackmagicControllerEvents>> {
		return this.device.eventNames()
	}

	public listeners<T extends EventEmitter.EventNames<BlackmagicControllerEvents>>(
		event: T,
	): Array<EventEmitter.EventListener<BlackmagicControllerEvents, T>> {
		return this.device.listeners(event)
	}

	public listenerCount(event: EventEmitter.EventNames<BlackmagicControllerEvents>): number {
		return this.device.listenerCount(event)
	}

	public emit<T extends EventEmitter.EventNames<BlackmagicControllerEvents>>(
		event: T,
		...args: EventEmitter.EventArgs<BlackmagicControllerEvents, T>
	): boolean {
		return this.device.emit(event, ...args)
	}

	/**
	 * Add a listener for a given event.
	 */
	public on<T extends EventEmitter.EventNames<BlackmagicControllerEvents>>(
		event: T,
		fn: EventEmitter.EventListener<BlackmagicControllerEvents, T>,
		context?: unknown,
	): this {
		this.device.on(event, fn, context)
		return this
	}
	public addListener<T extends EventEmitter.EventNames<BlackmagicControllerEvents>>(
		event: T,
		fn: EventEmitter.EventListener<BlackmagicControllerEvents, T>,
		context?: unknown,
	): this {
		this.device.addListener(event, fn, context)
		return this
	}

	/**
	 * Add a one-time listener for a given event.
	 */
	public once<T extends EventEmitter.EventNames<BlackmagicControllerEvents>>(
		event: T,
		fn: EventEmitter.EventListener<BlackmagicControllerEvents, T>,
		context?: unknown,
	): this {
		this.device.once(event, fn, context)
		return this
	}

	/**
	 * Remove the listeners of a given event.
	 */
	public removeListener<T extends EventEmitter.EventNames<BlackmagicControllerEvents>>(
		event: T,
		fn?: EventEmitter.EventListener<BlackmagicControllerEvents, T>,
		context?: unknown,
		once?: boolean,
	): this {
		this.device.removeListener(event, fn, context, once)
		return this
	}
	public off<T extends EventEmitter.EventNames<BlackmagicControllerEvents>>(
		event: T,
		fn?: EventEmitter.EventListener<BlackmagicControllerEvents, T>,
		context?: unknown,
		once?: boolean,
	): this {
		this.device.off(event, fn, context, once)
		return this
	}

	public removeAllListeners(event?: EventEmitter.EventNames<BlackmagicControllerEvents>): this {
		this.device.removeAllListeners(event)
		return this
	}
}
