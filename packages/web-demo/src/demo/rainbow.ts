import type { BlackmagicController } from '@blackmagic-controller/web'
import type { Demo } from './demo.js'

const colors = [
	{ red: true, green: false, blue: false },
	{ red: true, green: true, blue: false },
	{ red: false, green: true, blue: false },
	{ red: false, green: true, blue: true },
	{ red: false, green: false, blue: true },
	{ red: false, green: false, blue: false },
	{ red: true, green: true, blue: true },
]

export class RainbowDemo implements Demo {
	private counter = 0
	private tbarProgress = 0
	private interval: number | undefined
	private running: Promise<void> | undefined

	private async drawButtons(device: BlackmagicController) {
		const ps: Promise<void>[] = []

		const values = []

		for (const control of device.CONTROLS) {
			if (control.type === 'button') {
				const colorIndex = (colors.length + control.column + control.row - this.counter) % colors.length
				const color = colors[colorIndex]

				values.push({ keyId: control.id, ...color })
			} else if (control.type === 'tbar' && control.ledSegments > 0) {
				const values = new Array(control.ledSegments).fill(false)
				values[this.tbarProgress] = true

				// TODO: it would be better to batch this, but this is good enough
				ps.push(device.setTbarLeds(values))

				this.tbarProgress++
				if (this.tbarProgress >= control.ledSegments) this.tbarProgress = 0
			}
		}

		ps.push(device.setButtonStates(values))

		this.counter++
		if (this.counter >= colors.length) this.counter = 0

		await Promise.all(ps)
	}

	public async start(device: BlackmagicController): Promise<void> {
		await device.clearPanel()

		this.counter = 0
		this.tbarProgress = 0

		await this.drawButtons(device)

		if (!this.interval) {
			const doThing = async () => {
				if (!this.running) {
					this.running = this.drawButtons(device)
					await this.running
					this.running = undefined
				}
			}
			this.interval = window.setInterval(() => {
				doThing().catch((e) => console.error(e))
			}, 1000 / 5)
		}
	}
	public async stop(device: BlackmagicController): Promise<void> {
		if (this.interval) {
			window.clearInterval(this.interval)
			this.interval = undefined
		}
		await this.running
		await device.clearPanel()
	}
	public async keyDown(device: BlackmagicController, keyId: string): Promise<void> {
		// No-op
	}
	public async keyUp(device: BlackmagicController, keyId: string): Promise<void> {
		// No-op
	}
}
