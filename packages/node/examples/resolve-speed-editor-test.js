// @ts-check
import { BlackmagicControllerModelId, listBlackmagicControllers, openBlackmagicController } from '../dist/index.js'

async function findAndOpenPanel(retryCount = 100, retryInterval = 2000) {
	for (let attempt = 1; attempt <= retryCount; attempt++) {
		console.log(`Attempt ${attempt}/${retryCount}: Searching for DaVinci Resolve Speed Editor...`)

		const devices = await listBlackmagicControllers()
		const selectedDev = devices.find((d) => d.model === BlackmagicControllerModelId.DaVinciResolveSpeedEditor)

		if (selectedDev) {
			console.log(`----- Found DaVinci Resolve Speed Editor -----`)
			return await openBlackmagicController(selectedDev.path)
		}

		if (attempt < retryCount) {
			console.log(`No device found. Retrying in ${retryInterval / 1000} seconds...`)
			await new Promise((resolve) => setTimeout(resolve, retryInterval))
		}
	}

	throw new Error(`No DaVinci Resolve Speed Editor found after ${retryCount} attempts`)
}

const panel = await findAndOpenPanel()

if (panel.MODEL !== BlackmagicControllerModelId.DaVinciResolveSpeedEditor)
	throw new Error('This test is for the DaVinci Resolve Speed Editor only')

await panel.clearPanel()

console.log(`Opened panel ${panel.MODEL}`)
console.log('Panel serial number is', await panel.getSerialNumber())
console.log('Panel firmware version is', await panel.getFirmwareVersion())

const batteryLevel = await panel.getBatteryLevel()
if (batteryLevel !== null) {
	console.log(`Battery level: ${batteryLevel * 100}%`)
}

const batteryCharging = await panel.getBatteryCharging()
if (batteryCharging !== null) {
	console.log(`Battery is charging: ${batteryCharging ? 'true' : 'false'}`)
}

// Set jog wheel to velocity mode
await panel.setJogMode(0) // 0 = velocity mode, 1 = shuttle mode
console.log('Jog mode is set to 0 (velocity)')

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

panel.on('jogVelocity', (control, velocity) => {
	console.log(`Jog ${control.id} velocity ${velocity}`)
})

panel.on('batteryLevel', (percent) => {
	console.log(`Battery level ${percent * 100}%`)
})
