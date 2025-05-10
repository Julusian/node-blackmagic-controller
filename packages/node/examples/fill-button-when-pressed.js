// @ts-check
const { listBlackmagicControllers, openBlackmagicController } = require('../dist/index')

;(async () => {
	const devices = await listBlackmagicControllers()
	if (!devices[0]) throw new Error('No device found')

	const panel = await openBlackmagicController(devices[0].path)
	await panel.clearPanel()

	console.log(`opened panel ${panel.MODEL}`)
	console.log('battery level', await panel.getBatteryLevel())
	console.log('serial', await panel.getSerialNumber())
	console.log('firmware', await panel.getFirmwareVersion())

	let nextColor = 0

	panel.on('down', (control) => {
		if (control.type !== 'button') return

		const color = nextColor++
		if (nextColor >= 3) nextColor = 0

		// Fill the pressed key
		console.log(`Filling button "${control.id}"`)
		panel
			.setButtonColor(control.id, color == 0, color == 1, color == 2)
			.catch((e) => console.error('Fill failed:', e))
	})

	panel.on('up', (control) => {
		if (control.type !== 'button') return

		// Clear the key when it is released.
		console.log(`clearing button "${control.id}"`)
		panel.clearKey(control.id).catch((e) => console.error('Clear failed:', e))
	})

	panel.on('tbar', (control, percent) => {
		console.log(`T-bar "${control.id}" moved to ${percent * 100}%`)
	})

	panel.on('batteryLevel', (percent) => {
		console.log(`Battery level ${percent * 100}%`)
	})

	panel.on('error', (error) => {
		console.error(error)
	})
})()
