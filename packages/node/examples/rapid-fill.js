// @ts-check
const { openBlackmagicController, listBlackmagicControllers } = require('../dist/index.js')

listBlackmagicControllers().then(async (devices) => {
	if (!devices[0]) throw new Error('No device found')

	openBlackmagicController(devices[0].path).then((panel) => {
		panel.on('error', (error) => {
			console.error(error)
		})

		let isFilling = false
		setInterval(() => {
			if (isFilling) return
			isFilling = true

			Promise.resolve().then(async () => {
				try {
					const red = Math.random() >= 0.5
					const green = Math.random() >= 0.5
					const blue = Math.random() >= 0.5
					console.log('Filling with rgb(%d, %d, %d)', red, green, blue)

					const values = []

					for (const control of panel.CONTROLS) {
						if (control.type === 'button') {
							values.push({ keyId: control.id, red, green, blue })
						} else if (control.type === 'tbar' && control.ledSegments > 0) {
							const target = Math.random() * (control.ledSegments + 1)
							const values = []
							for (let i = 1; i <= control.ledSegments; i++) {
								values.unshift(target >= i)
							}
							// TODO: it would be better to batch this, but this is good enough
							await panel.setTbarLeds(values)
						}
					}

					await panel.setButtonColors(values)
				} catch (e) {
					console.error('Fill failed:', e)
				} finally {
					isFilling = false
				}
			})
		}, 1000 / 5)
	})
})
