// @ts-check
import { BlackmagicControllerModelId, listBlackmagicControllers, openBlackmagicController } from '../dist/index.js'

const devices = await listBlackmagicControllers()
const selectedDev = devices.find((d) => d.model === BlackmagicControllerModelId.DaVinciResolveSpeedEditor)
if (!selectedDev) throw new Error('No device found')

const panel = await openBlackmagicController(selectedDev.path)

if (panel.modelInfo.id !== BlackmagicControllerModelId.DaVinciResolveSpeedEditor)
	throw new Error('This test is for the DaVinci Resolve Speed Editor only')

await panel.clearPanel()

console.log(`opened panel ${panel.modelInfo.id}`)
console.log('serial', await panel.getSerialNumber())
console.log('firmware', await panel.getFirmwareVersion())

let nextColor = 0

panel.on('down', (control) => {
	console.log(`Down "${control.id}"`)
	if (control.type !== 'button' || control.feedbackType === 'none') return

	const color = nextColor++
	if (nextColor >= 3) nextColor = 0

	// Fill the pressed key
	console.log(`Filling button "${control.id}"`)
	panel
		.setButtonStates([
			control.feedbackType === 'rgb'
				? {
						type: 'rgb',
						keyId: control.id,
						red: color == 0,
						green: color == 1,
						blue: color == 2,
					}
				: {
						type: 'on-off',
						keyId: control.id,
						on: true,
					},
		])
		.catch((e) => console.error('Fill failed:', e))
})

panel.on('up', (control) => {
	console.log(`Up "${control.id}"`)

	if (control.type !== 'button' || control.feedbackType === 'none') return

	// Clear the key when it is released.
	console.log(`clearing button "${control.id}"`)
	panel.clearKey(control.id).catch((e) => console.error('Clear failed:', e))
})

panel.on('tbar', (control, percent) => {
	console.log(`T-bar "${control.id}" moved to ${percent * 100}%`)
})

panel.on('jog', (control, velocity) => {
	console.log(`Jog "${control.id}" velocity ${velocity}`)
})

panel.on('batteryLevel', (percent) => {
	console.log(`Battery level ${percent * 100}%`)
})

panel.on('error', (error) => {
	console.error(error)
})
