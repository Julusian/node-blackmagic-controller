import type { BlackmagicController } from '@blackmagic-controller/web'
import type { Demo } from './demo.js'

export class RapidFillDemo implements Demo {
	private interval: number | undefined
	private running: Promise<void[]> | undefined

	public async start(device: BlackmagicController): Promise<void> {
		if (!this.interval) {
			const doThing = async () => {
				if (!this.running) {
					const red = Math.random() >= 0.5
					const green = Math.random() >= 0.5
					const blue = Math.random() >= 0.5
					console.log('Filling with rgb(%d, %d, %d)', red, green, blue)

					const values = []
					const ps: Promise<void>[] = []

					for (const control of device.CONTROLS) {
						if (control.type === 'button') {
							values.push({ keyId: control.id, red, green, blue })
						} else if (control.type === 'tbar' && control.ledSegments > 0) {
							const target = Math.random() * (control.ledSegments + 1)
							const values = []
							for (let i = 1; i <= control.ledSegments; i++) {
								values.unshift(target >= i)
							}
							// TODO: it would be better to batch this, but this is good enough
							ps.push(device.setTbarLeds(values))
						}
					}

					ps.push(device.setButtonStates(values))

					this.running = Promise.all(ps)
					await this.running
					this.running = undefined
				}
			}
			this.interval = window.setInterval(() => {
				doThing().catch((e) => console.log(e))
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
	public async keyDown(_device: BlackmagicController, _keyId: string): Promise<void> {
		// Nothing to do
	}
	public async keyUp(_device: BlackmagicController, _keyId: string): Promise<void> {
		// Nothing to do
	}
}
