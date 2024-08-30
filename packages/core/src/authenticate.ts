import type { HIDDevice } from './hid-device'
import { uint8ArrayToDataView } from './util'

/*
 * This is based on the work from
 * https://github.com/smunaut/blackmagic-misc/blob/master/bmd.py
 */

function generatePacket(featureReport: number, step: number, value: bigint): Uint8Array {
	const packet = new Uint8Array(10)
	const view = uint8ArrayToDataView(packet)

	view.setUint8(0, featureReport)
	view.setUint8(1, step)
	view.setBigUint64(2, value, true)

	return packet
}

/**
 * Perform the authentication handshake with the device
 * @param device Device handle
 * @param featureReport Report id to use for the authentication
 * @returns Timeout until authentication is required again
 */
export async function authenticate(device: HIDDevice, featureReport: number): Promise<number> {
	// Reset the state machine
	await device.sendFeatureReport(generatePacket(featureReport, 0, 0n))

	// Read the keyboard challenge (for keyboard to authenticate app)
	const challenge = await device.getFeatureReport(featureReport, 10)

	// Send our challenge (to authenticate the controller)
	// We don't care ... so just send 0x0000000000000000
	await device.sendFeatureReport(generatePacket(featureReport, 1, 0n))

	// Read the keyboard response
	// Again, we don't care, ignore the result
	await device.getFeatureReport(featureReport, 10)

	// Compute and send our response
	const challengeView = uint8ArrayToDataView(challenge)
	const response = bmd_kbd_auth(challengeView.getBigUint64(2, true))
	await device.sendFeatureReport(generatePacket(featureReport, 3, response))

	// Read the status
	const status = await device.getFeatureReport(featureReport, 10)
	const statusView = uint8ArrayToDataView(status)
	if (status[1] !== 0x04) throw new Error('Authentication failed')

	// This is likely the timeout until authentication is required again
	return statusView.getUint16(2, true)
}

function rol8(v: bigint) {
	return ((v << 56n) | (v >> 8n)) & 0xffffffffffffffffn
}

function rol8n(v: bigint, n: number) {
	for (let i = 0; i < n; i++) {
		v = rol8(v)
	}
	return v
}

const AUTH_EVEN_TBL = [
	0x3ae1206f97c10bc8n,
	0x2a9ab32bebf244c6n,
	0x20a6f8b8df9adf0an,
	0xaf80ece52cfc1719n,
	0xec2ee2f7414fd151n,
	0xb055adfd73344a15n,
	0xa63d2e3059001187n,
	0x751bf623f42e0dden,
]
const AUTH_ODD_TBL = [
	0x3e22b34f502e7fden,
	0x24656b981875ab1cn,
	0xa17f3456df7bf8c3n,
	0x6df72e1941aef698n,
	0x72226f011e66ab94n,
	0x3831a3c606296b42n,
	0xfd7ff81881332c89n,
	0x61a3f6474ff236c6n,
]
const MASK = 0xa79a63f585d37bf0n

function bmd_kbd_auth(challenge: bigint) {
	let n = Number(challenge & 7n)
	let v = rol8n(challenge, n)

	let k

	if ((v & 1n) == (BigInt(0x78 >> n) & 1n)) {
		k = AUTH_EVEN_TBL[n]
	} else {
		v = v ^ rol8(v)
		k = AUTH_ODD_TBL[n]
	}

	return v ^ (rol8(v) & MASK) ^ k
}
