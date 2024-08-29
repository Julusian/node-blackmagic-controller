import { HIDAsync, devices } from 'node-hid'
import { NodeHIDDevice } from '../dist/hid-device.js'
import { authenticate } from '@blackmagic-panel/core/dist/authenticate.js'

console.log(devices().filter((d) => d.vendorId === 0x1edb && d.productId === 0xbef0))

const atem = await HIDAsync.open(0x1edb, 0xbef0)

const atem2 = new NodeHIDDevice(atem)

// atem.on('data', (data) => {
// 	console.log(data)
// })

// only needed when over usb
const info = await atem.getDeviceInfo()
console.log('info', info)
if (info.interface !== -1) {
	// HACK: this is -1 when bluetooth
	const res = await authenticate(atem2, 5)
	console.log('authenticate', res)
}

console.log('battery?', await atem.getFeatureReport(6, 3))
// {
// 	const w = Buffer.alloc(32)
// 	w[0] = 0x02
// 	w[2] = 0x80
// 	w[6] = 0x40
// 	// w[8] = 0x20
// 	// w[12] = 0x02
// 	await atem.write(w)
// }

// { // flashing state?
// 	const w = Buffer.alloc(32)
// 	w[0] = 0x02
// 	w[2] = 0x20
// 	w[10] = 0x20
// 	w[5] = 0x13
// 	w[31] = 0x02

// 	// w[2] = 0x80
// 	// w[4] = 0x80
// 	// w[5] = 0x03
// 	// w[12] = 0x02
// 	// w[14] = 0x1c
// 	// w[17] = 0x1c
// 	await atem.write(w)
// }

// {
// 	const w = Buffer.alloc(32)
// 	w[0] = 0x02
// 	w[4] = 0x80
// 	w[5] = 0x03
// 	w[6] = 0x40
// 	w[14] = 0x1c
// 	w[17] = 0x1c
// 	await atem.write(w)
// }

{
	const w = Buffer.alloc(32)
	w[0] = 0x02
	w[1] = 0b11111111
	w[2] = 0b11111111
	w[4] = 0x80
	w[5] = 0x13
	w[6] = 0x42
	w[11] = 0xff
	w[12] = 0x42
	/*
	 * 8 = 5r
	 * 7 = 5g
	 * 6 = 5b
	 * 5 = 6r
	 * 4 = 6g
	 * 3 = 6b
	 * 2 = 7r
	 * 1 = 7g
	 */
	w[12] = 0b00000000
	w[13] = 0x42
	w[14] = 0xff
	w[17] = 0xff
	w[19] = 0xff
	w[21] = 0b11111111
	await atem.write(w)
}

// {
// 	const w = Buffer.alloc(32)
// 	w[0] = 0x02
// 	w[12] = 0b01010000
// 	w[21] = 0b10111101
// 	w[31] = 0x02
// 	await atem.write(w)
// }

// {
// 	const w = Buffer.alloc(32)
// 	w[0] = 0x02
// 	w[31] = 0x01
// 	await atem.write(w)
// }
