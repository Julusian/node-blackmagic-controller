import type { BlackmagicControllerControlDefinition } from './controlDefinition.js'
import type { Dimension } from './info.js'
import { BlackmagicControllerModelId } from './info.js'
import type { BlackmagicControllerProperties, BlackmagicControllerStaticProperties } from './models/base.js'
import {
	atemMicroPanelProperties,
	resolveReplayEditorProperties,
	resolveSpeedEditorProperties,
} from './models/definitions.js'

/** Blackmagic vendor id */
export const VENDOR_ID = 0x1edb

const MANUFACTURER_BLACKMAGIC = 'Blackmagic Design'

export enum BlackmagicControllerModelType {
	/** A panel for controlling an ATEM switcher */
	ATEM_PANEL = 'atem-panel',
	/** A panel for editing in DaVinci Resolve */
	RESOLVE_EDITOR = 'resolve-editor',
}

/** A transport which a device can be connected over */
export type BlackmagicControllerTransport = 'usb' | 'bluetooth'

/** The properties of a usb device which identify it as a model */
export interface UsbMatch {
	vendorId: number
	productId: number
	/**
	 * If needing to filter by usage
	 */
	hidUsage?: number
	/**
	 * If needing to filter by interface number
	 */
	hidInterface?: number
}

/** The optional capabilities of a model */
export interface BlackmagicControllerModelFeatures {
	/** Whether the device has a battery */
	battery: boolean
}

/**
 * Static information about a model of Blackmagic controller.
 * This holds no functions, so can be consumed without pulling in the code needed to drive a device.
 */
export interface BlackmagicControllerModelInfo {
	id: BlackmagicControllerModelId
	name: string
	manufacturer: string
	category: BlackmagicControllerModelType

	/**
	 * The usb devices which identify as this model. Empty for models which are not connected over usb.
	 * Over bluetooth these models report the same ids as a HID device, so these identify them there too
	 */
	usb: readonly UsbMatch[]
	/** The transports this model can be connected over */
	transports: readonly BlackmagicControllerTransport[]

	controls: Readonly<BlackmagicControllerControlDefinition[]>

	/** The extent of the face, which every control's `bounds` is within */
	faceSize: Dimension

	features: BlackmagicControllerModelFeatures
}

/**
 * A model's public info, paired with the properties needed to drive it.
 *
 * The two are built together from a single source, so they cannot describe
 * different models. The properties are internal and are never exported from
 * the package index.
 * @internal
 */
export interface BlackmagicControllerModelDefinition {
	readonly info: BlackmagicControllerModelInfo
	readonly properties: BlackmagicControllerProperties
}

interface ModelInfoOptions {
	category: BlackmagicControllerModelType
	usb: UsbMatch[]
	/** Whether the device can be connected to over bluetooth */
	bluetooth: boolean
}

function createModelDefinition(
	id: BlackmagicControllerModelId,
	name: string,
	properties: BlackmagicControllerStaticProperties,
	options: ModelInfoOptions,
): BlackmagicControllerModelDefinition {
	const transports: BlackmagicControllerTransport[] = []
	if (options.usb.length > 0) transports.push('usb')
	if (options.bluetooth) transports.push('bluetooth')

	const info: BlackmagicControllerModelInfo = Object.freeze({
		id,
		name,
		manufacturer: MANUFACTURER_BLACKMAGIC,
		category: options.category,

		usb: Object.freeze(options.usb.map((match) => Object.freeze(match))),
		transports: Object.freeze(transports),

		controls: properties.controls,
		faceSize: Object.freeze({ ...properties.faceSize }),

		features: Object.freeze({
			battery: properties.hasBattery,
		}),
	})

	return Object.freeze({
		info,
		properties: Object.freeze({ ...properties, model: id, productName: name }),
	})
}

/**
 * Every known model, as its public info paired with the properties to drive it.
 * @internal
 */
export const DEVICE_MODEL_DEFINITIONS: Readonly<{
	[id in BlackmagicControllerModelId]: BlackmagicControllerModelDefinition
}> = Object.freeze({
	[BlackmagicControllerModelId.AtemMicroPanel]: createModelDefinition(
		BlackmagicControllerModelId.AtemMicroPanel,
		'ATEM Micro Panel',
		atemMicroPanelProperties,
		{
			category: BlackmagicControllerModelType.ATEM_PANEL,
			usb: [{ vendorId: VENDOR_ID, productId: 0xbef0 }],
			bluetooth: true,
		},
	),
	[BlackmagicControllerModelId.DaVinciResolveReplayEditor]: createModelDefinition(
		BlackmagicControllerModelId.DaVinciResolveReplayEditor,
		'DaVinci Resolve Replay Editor',
		resolveReplayEditorProperties,
		{
			category: BlackmagicControllerModelType.RESOLVE_EDITOR,
			usb: [{ vendorId: VENDOR_ID, productId: 0xda11 }],
			bluetooth: true,
		},
	),
	[BlackmagicControllerModelId.DaVinciResolveSpeedEditor]: createModelDefinition(
		BlackmagicControllerModelId.DaVinciResolveSpeedEditor,
		'DaVinci Resolve Speed Editor',
		resolveSpeedEditorProperties,
		{
			category: BlackmagicControllerModelType.RESOLVE_EDITOR,
			usb: [{ vendorId: VENDOR_ID, productId: 0xda0e }],
			bluetooth: true,
		},
	),
})

/**
 * Static information about every known model.
 * @experimental Will become DEVICE_MODELS in v2
 */
export const DEVICE_MODEL_INFO: Readonly<{ [id in BlackmagicControllerModelId]: BlackmagicControllerModelInfo }> =
	Object.freeze(
		Object.fromEntries(
			Object.values(DEVICE_MODEL_DEFINITIONS).map((definition) => [definition.info.id, definition.info]),
		),
	) as Readonly<{ [id in BlackmagicControllerModelId]: BlackmagicControllerModelInfo }>

const ALL_MODEL_INFO: readonly BlackmagicControllerModelInfo[] = Object.freeze(Object.values(DEVICE_MODEL_INFO))

/**
 * Get the information about a model, if it is known
 */
export function getModelInfo(id: BlackmagicControllerModelId): BlackmagicControllerModelInfo | undefined {
	return DEVICE_MODEL_INFO[id]
}

/**
 * Find the model which a usb device identifies as, if any.
 * The `usage` and `hidInterface` are only checked when both the model requires it, and a value is provided.
 */
export function findModelByUsb(
	vendorId: number,
	productId: number,
	usage?: number,
	hidInterface?: number,
): BlackmagicControllerModelInfo | undefined {
	for (const model of ALL_MODEL_INFO) {
		for (const match of model.usb) {
			if (match.vendorId !== vendorId || match.productId !== productId) continue
			if (match.hidUsage !== undefined && usage !== undefined && usage !== match.hidUsage) continue
			if (match.hidInterface !== undefined && hidInterface !== undefined && hidInterface !== match.hidInterface)
				continue

			return model
		}
	}

	return undefined
}
