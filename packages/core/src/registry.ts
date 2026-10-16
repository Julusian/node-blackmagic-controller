import type { HIDDevice } from './hid-device.js'
import { BlackmagicControllerModelId } from './info.js'
import type { BlackmagicController } from './types.js'
import type { OpenBlackmagicControllerOptions, OpenBlackmagicControllerOptionsInternal } from './models/base.js'
import type { BlackmagicControllerModelDefinition } from './modelInfo.js'
import { DEVICE_MODEL_DEFINITIONS } from './modelInfo.js'
import { authenticate } from './authenticate.js'
import { AtemMicroPanelFactory } from './models/atem-micro-panel.js'
import { ResolveReplayEditorFactory } from './models/resolve-replay-editor.js'
import { ResolveSpeedEditorFactory } from './models/resolve-speed-editor.js'

/**
 * Constructs a BlackmagicController for a model, from its definition.
 * Internal: the definition carries the properties, which are not public.
 */
type BlackmagicControllerModelFactory = (
	definition: BlackmagicControllerModelDefinition,
	device: HIDDevice,
	options: Required<OpenBlackmagicControllerOptionsInternal>,
) => BlackmagicController

/** Performs the authentication handshake with a device. Resolves with the delay until it must be repeated */
type BlackmagicControllerAuthenticate = (device: HIDDevice) => Promise<number>

/**
 * Opens a device of a known model, performing any authentication the model requires.
 * Already bound to the model it was looked up by
 */
export type BlackmagicControllerDriver = (
	device: HIDDevice,
	options?: OpenBlackmagicControllerOptions,
) => Promise<BlackmagicController>

export interface DeviceModelSpec {
	id: BlackmagicControllerModelId
	productIds: number[]
	factory: (device: HIDDevice, options: Required<OpenBlackmagicControllerOptionsInternal>) => BlackmagicController

	authenticate?: (device: HIDDevice) => Promise<number>
}

interface ModelDriverSpec {
	factory: BlackmagicControllerModelFactory
	authenticate: BlackmagicControllerAuthenticate | null
}

const DEVICE_MODEL_DRIVER_SPECS: { [id in BlackmagicControllerModelId]: ModelDriverSpec } = {
	[BlackmagicControllerModelId.AtemMicroPanel]: {
		factory: AtemMicroPanelFactory,
		authenticate: async (device) => authenticate(device, 5),
	},
	[BlackmagicControllerModelId.DaVinciResolveReplayEditor]: {
		factory: ResolveReplayEditorFactory,
		authenticate: async (device) => {
			// Perform twice because thats what resolve appears to do
			await authenticate(device, 6)
			return authenticate(device, 6)
		},
	},
	[BlackmagicControllerModelId.DaVinciResolveSpeedEditor]: {
		factory: ResolveSpeedEditorFactory,
		authenticate: async (device) => authenticate(device, 6),
	},
}

/**
 * Each factory bound to its own model definition, so a caller can never pair a
 * driver with a model it was not built for.
 */
const DEVICE_MODEL_DRIVERS: { [id in BlackmagicControllerModelId]: BlackmagicControllerDriver } = Object.freeze(
	Object.fromEntries(
		Object.values(DEVICE_MODEL_DEFINITIONS).map(
			(definition): [BlackmagicControllerModelId, BlackmagicControllerDriver] => {
				const spec = DEVICE_MODEL_DRIVER_SPECS[definition.info.id]

				return [
					definition.info.id,
					async (device, _options) => {
						// Perform authentication if required by the model
						const nextAuthMaxDelay = spec.authenticate ? await spec.authenticate(device) : null

						return spec.factory(definition, device, {
							nextAuthMaxDelay,
							authenticate: spec.authenticate,
						})
					},
				]
			},
		),
	),
) as { [id in BlackmagicControllerModelId]: BlackmagicControllerDriver }

/**
 * Get the driver to open a device of a model.
 *
 * This is the integration point for libraries which provide their own HID implementation, and is not intended for
 * end users. The driver performs any authentication the model requires before resolving.
 */
export function getDriver(id: BlackmagicControllerModelId): BlackmagicControllerDriver | undefined {
	return DEVICE_MODEL_DRIVERS[id]
}

function createLegacySpec(definition: BlackmagicControllerModelDefinition): Omit<DeviceModelSpec, 'id'> {
	const spec = DEVICE_MODEL_DRIVER_SPECS[definition.info.id]

	return {
		productIds: definition.info.usb.map((match) => match.productId),
		factory: (device, options) => spec.factory(definition, device, options),
		authenticate: spec.authenticate ?? undefined,
	}
}

/**
 * List of all the known models, and the classes to use them
 * @deprecated Use `DEVICE_MODEL_INFO` and {@link getDriver} instead
 */
export const DEVICE_MODELS2: { [key in BlackmagicControllerModelId]: Omit<DeviceModelSpec, 'id'> } = Object.fromEntries(
	Object.values(DEVICE_MODEL_DEFINITIONS).map((definition) => [definition.info.id, createLegacySpec(definition)]),
) as { [key in BlackmagicControllerModelId]: Omit<DeviceModelSpec, 'id'> }

/** @deprecated Use `DEVICE_MODEL_INFO` and {@link getDriver} instead */
export const DEVICE_MODELS: DeviceModelSpec[] = Object.entries<Omit<DeviceModelSpec, 'id'>>(DEVICE_MODELS2).map(
	([id, spec]) => ({ id: id as any as BlackmagicControllerModelId, ...spec }),
)
