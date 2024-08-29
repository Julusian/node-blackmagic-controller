// @ts-check
const { usb } = require('usb')
const { listBlackmagicPanels, openBlackmagicPanel } = require('../dist/index')
const panels = {}

async function addDevice(info) {
	const path = info.path
	const panel = await openBlackmagicPanel(path)
	panels[path] = panel

	console.log(info)
	console.log('Serial:', await panels[path].getSerialNumber())
	console.log('Firmware:', await panels[path].getFirmwareVersion())

	// Clear all keys
	await panels[path].clearPanel()
	// Fill one key in red
	await panels[path].fillKeyColor(0, 255, 0, 0)

	await panels[path].resetToLogo()

	panels[path].on('error', (e) => {
		console.log(e)
		// assuming any error means we lost connection
		panels[path].removeAllListeners()
		delete panels[path]
	})
	//  add any other event listeners
}

async function refresh() {
	const panelList = await listBlackmagicPanels()
	panelList.forEach((device) => {
		if (!panels[device.path]) {
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
