// @ts-check
const { openBlackmagicPanel, listBlackmagicPanels } = require('../dist/index')

listBlackmagicPanels().then(async (devices) => {
	if (!devices[0]) throw new Error('No device found')

	openBlackmagicPanel(devices[0].path).then((panel) => {
		panel.on('error', (error) => {
			console.error(error)
		})

		let isFilling = false
		setInterval(() => {
			if (isFilling) return
			isFilling = true

			Promise.resolve().then(async () => {
				try {
					const values = []

					for (const control of panel.CONTROLS) {
						if (control.type === 'button') {
							const red = Math.random() >= 0.5
							const green = Math.random() >= 0.5
							const blue = Math.random() >= 0.5
							values.push({ keyId: control.id, red, green, blue })
						} else if (control.type === 'tbar' && control.ledSegments > 0) {
							const values = []
							for (let i = 0; i < control.ledSegments; i++) {
								values.push(Math.random() >= 0.5)
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
		}, 1000 / 10)
	})
})
