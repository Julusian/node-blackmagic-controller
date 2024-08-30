// @ts-check
const { usb } = require('usb')
const { listBlackmagicControllers, openBlackmagicController } = require('../dist/index')
const controllers = {}

async function addDevice(info) {
	const path = info.path
	const controller = await openBlackmagicController(path)
	controllers[path] = controller

	console.log(info)
	console.log('Serial:', await controllers[path].getSerialNumber())
	console.log('Firmware:', await controllers[path].getFirmwareVersion())

	// Clear all keys
	await controllers[path].clearPanel()
	// Fill one key in red
	await controllers[path].fillKeyColor(0, 255, 0, 0)

	await controllers[path].resetToLogo()

	controllers[path].on('error', (e) => {
		console.log(e)
		// assuming any error means we lost connection
		controllers[path].removeAllListeners()
		delete controllers[path]
	})
	//  add any other event listeners
}

async function refresh() {
	const controllerList = await listBlackmagicControllers()
	controllerList.forEach((device) => {
		if (!controllers[device.path]) {
			addDevice(device).catch((e) => console.error('Add failed:', e))
		}
	})
}
refresh()

usb.on('attach', function (e) {
	if (e.deviceDescriptor.idVendor === 0x0fd9) {
		refresh()
	}
})
usb.on('detach', function (e) {
	if (e.deviceDescriptor.idVendor === 0x0fd9) {
		console.log(`${JSON.stringify(e.deviceDescriptor)} was removed`)
		refresh()
	}
})
