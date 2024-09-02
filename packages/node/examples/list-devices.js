const { listBlackmagicControllers } = require('../dist/index')
const HID = require('node-hid')

console.log('RAW HID')
for (const dev of HID.devices()) {
	console.log(dev)
}

console.log('BLACKMAGIC CONTROLLERS')
listBlackmagicControllers().then((devs) => {
	for (const dev of devs) {
		console.log(dev)
	}
})
