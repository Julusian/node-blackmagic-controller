import type { BlackmagicControllerWeb } from '@blackmagic-controller/web'
import { requestBlackmagicControllers, getBlackmagicControllers } from '@blackmagic-controller/web'
import type { Demo } from './demo/demo'
import { FillWhenPressedDemo } from './demo/fill-when-pressed'
import { RapidFillDemo } from './demo/rapid-fill'
import { RainbowDemo } from './demo/rainbow'

declare const LIB_VERSION: any
if (LIB_VERSION) {
	const elm = document.querySelector('#version_str')
	if (elm) {
		elm.innerHTML = `v${LIB_VERSION}`
	}
}

function appendLog(str: string) {
	const logElm = document.getElementById('log')
	if (logElm) {
		logElm.textContent = `${str}\n${logElm.textContent ?? ''}`
	}
}

const demoSelect = document.getElementById('demo-select') as HTMLInputElement | undefined
const consentButton = document.getElementById('consent-button')

let device: BlackmagicControllerWeb | null = null
let currentDemo: Demo = new FillWhenPressedDemo()
async function demoChange() {
	if (demoSelect) {
		console.log(`Selected demo: ${demoSelect.value}`)
		if (device) {
			await currentDemo.stop(device)
		}

		switch (demoSelect.value) {
			case 'rapid-fill':
				currentDemo = new RapidFillDemo()
				break
			case 'rainbow':
				currentDemo = new RainbowDemo()
				break
			case 'fill-when-pressed':
			default:
				currentDemo = new FillWhenPressedDemo()
				break
		}

		if (device) {
			await currentDemo.start(device)
		}
	}
}

async function openDevice(device: BlackmagicControllerWeb): Promise<void> {
	appendLog(`Device opened. Serial: ${await device.getSerialNumber()} `) //Firmware: ${await device.getFirmwareVersion()}`)

	device.on('down', (control) => {
		if (control.type === 'button') {
			appendLog(`Key ${control.id} down`)
			currentDemo.keyDown(device, control.id).catch(console.error)
		}
	})
	device.on('up', (control) => {
		if (control.type === 'button') {
			appendLog(`Key ${control.id} up`)
			currentDemo.keyUp(device, control.id).catch(console.error)
		}
	})
	device.on('tbar', (control, value) => {
		// TODO
		// appendLog(
		// 	`LCD (${control.id}) swipe (${fromPosition.x},${fromPosition.y}) -> (${toPosition.x},${toPosition.y})`,
		// )
	})

	await currentDemo.start(device)

	// device.fillColor(2, 255, 0, 0)
	// device.fillColor(12, 0, 0, 255)
}

if (consentButton) {
	const doLoad = async () => {
		// attempt to open a previously selected device.
		const devices = await getBlackmagicControllers()
		console.log('load', devices)
		if (devices.length > 0) {
			device = devices[0]
			openDevice(device).catch(console.error)
		}
		console.log(devices)
	}
	window.addEventListener('load', () => {
		doLoad().catch((e) => console.error(e))
	})

	if (demoSelect) {
		demoSelect.addEventListener('input', () => {
			demoChange().catch(console.error)
		})
		demoChange().catch(console.error)
	}

	const consentClick = async () => {
		if (device) {
			appendLog('Closing device')
			currentDemo.stop(device).catch(console.error)
			await device.close()
			device = null
		}
		// Prompt for a device
		try {
			const devices = await requestBlackmagicControllers()
			device = devices[0]
			if (devices.length === 0) {
				appendLog('No device was selected')
				return
			}
		} catch (error) {
			appendLog(`No device access granted: ${error as string}`)
			console.log(error)
			return
		}

		openDevice(device).catch(console.error)
	}
	consentButton.addEventListener('click', () => {
		consentClick().catch((e) => console.error(e))
	})

	appendLog('Page loaded')
}
