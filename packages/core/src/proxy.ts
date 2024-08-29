import type { EventEmitter } from 'eventemitter3'
import type { DeviceModelId } from './id.js'
import type { BlackmagicPanel, BlackmagicPanelEvents } from './types.js'
import type { BlackmagicPanelControlDefinition } from './controlDefinition.js'

/**
 * A minimal proxy around a BlackmagicPanel instance.
 * This is intended to be used by libraries wrapping this that want to add more methods to the BlackmagicPanel
 */

export class BlackmagicPanelProxy implements BlackmagicPanel {
	protected device: BlackmagicPanel

	constructor(device: BlackmagicPanel) {
		this.device = device
	}

	public get CONTROLS(): Readonly<BlackmagicPanelControlDefinition[]> {
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
		...args: Parameters<BlackmagicPanel['getHidDeviceInfo']>
	): ReturnType<BlackmagicPanel['getHidDeviceInfo']> {
		return this.device.getHidDeviceInfo(...args)
	}
	public async setKeyColor(
		...args: Parameters<BlackmagicPanel['setKeyColor']>
	): ReturnType<BlackmagicPanel['setKeyColor']> {
		return this.device.setKeyColor(...args)
	}
	public async clearKey(...args: Parameters<BlackmagicPanel['clearKey']>): ReturnType<BlackmagicPanel['clearKey']> {
		return this.device.clearKey(...args)
	}
	public async clearPanel(
		...args: Parameters<BlackmagicPanel['clearPanel']>
	): ReturnType<BlackmagicPanel['clearPanel']> {
		return this.device.clearPanel(...args)
	}
	// public async setBrightness(
	// 	...args: Parameters<BlackmagicPanel['setBrightness']>
	// ): ReturnType<BlackmagicPanel['setBrightness']> {
	// 	return this.device.setBrightness(...args)
	// }
	public async getFirmwareVersion(): Promise<string> {
		return this.device.getFirmwareVersion()
	}
	public async getSerialNumber(): Promise<string> {
		return this.device.getSerialNumber()
	}

	/**
	 * EventEmitter
	 */

	public eventNames(): Array<EventEmitter.EventNames<BlackmagicPanelEvents>> {
		return this.device.eventNames()
	}

	public listeners<T extends EventEmitter.EventNames<BlackmagicPanelEvents>>(
		event: T,
	): Array<EventEmitter.EventListener<BlackmagicPanelEvents, T>> {
		return this.device.listeners(event)
	}

	public listenerCount(event: EventEmitter.EventNames<BlackmagicPanelEvents>): number {
		return this.device.listenerCount(event)
	}

	public emit<T extends EventEmitter.EventNames<BlackmagicPanelEvents>>(
		event: T,
		...args: EventEmitter.EventArgs<BlackmagicPanelEvents, T>
	): boolean {
		return this.device.emit(event, ...args)
	}

	/**
	 * Add a listener for a given event.
	 */
	public on<T extends EventEmitter.EventNames<BlackmagicPanelEvents>>(
		event: T,
		fn: EventEmitter.EventListener<BlackmagicPanelEvents, T>,
		context?: unknown,
	): this {
		this.device.on(event, fn, context)
		return this
	}
	public addListener<T extends EventEmitter.EventNames<BlackmagicPanelEvents>>(
		event: T,
		fn: EventEmitter.EventListener<BlackmagicPanelEvents, T>,
		context?: unknown,
	): this {
		this.device.addListener(event, fn, context)
		return this
	}

	/**
	 * Add a one-time listener for a given event.
	 */
	public once<T extends EventEmitter.EventNames<BlackmagicPanelEvents>>(
		event: T,
		fn: EventEmitter.EventListener<BlackmagicPanelEvents, T>,
		context?: unknown,
	): this {
		this.device.once(event, fn, context)
		return this
	}

	/**
	 * Remove the listeners of a given event.
	 */
	public removeListener<T extends EventEmitter.EventNames<BlackmagicPanelEvents>>(
		event: T,
		fn?: EventEmitter.EventListener<BlackmagicPanelEvents, T>,
		context?: unknown,
		once?: boolean,
	): this {
		this.device.removeListener(event, fn, context, once)
		return this
	}
	public off<T extends EventEmitter.EventNames<BlackmagicPanelEvents>>(
		event: T,
		fn?: EventEmitter.EventListener<BlackmagicPanelEvents, T>,
		context?: unknown,
		once?: boolean,
	): this {
		this.device.off(event, fn, context, once)
		return this
	}

	public removeAllListeners(event?: EventEmitter.EventNames<BlackmagicPanelEvents>): this {
		this.device.removeAllListeners(event)
		return this
	}
}
