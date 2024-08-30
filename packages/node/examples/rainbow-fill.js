// @ts-check
const { openBlackmagicController, listBlackmagicControllers } = require('../dist/index')

const colors = [
	{ red: true, green: false, blue: false },
	{ red: true, green: true, blue: false },
	{ red: false, green: true, blue: false },
	{ red: false, green: true, blue: true },
	{ red: false, green: false, blue: true },
	{ red: false, green: false, blue: false },
	{ red: true, green: true, blue: true },
]

listBlackmagicControllers().then(async (devices) => {
	if (!devices[0]) throw new Error('No device found')

	openBlackmagicController(devices[0].path).then((panel) => {
		panel.on('error', (error) => {
			console.error(error)
		})

		let offset = 0
		let tbarProgress = 0

		let isFilling = false
		setInterval(() => {
			if (isFilling) return
			isFilling = true

			Promise.resolve().then(async () => {
				try {
					const values = []

					for (const control of panel.CONTROLS) {
						if (control.type === 'button') {
							const colorIndex = (colors.length + control.column + control.row - offset) % colors.length
							const color = colors[colorIndex]

							values.push({ keyId: control.id, ...color })
						} else if (control.type === 'tbar' && control.ledSegments > 0) {
							const values = new Array(control.ledSegments).fill(false)
							values[tbarProgress] = true

							// TODO: it would be better to batch this, but this is good enough
							await panel.setTbarLeds(values)

							tbarProgress++
							if (tbarProgress >= control.ledSegments) tbarProgress = 0
						}
					}

					await panel.setButtonColors(values)
				} catch (e) {
					console.error('Fill failed:', e)
				} finally {
					isFilling = false

					offset++
					if (offset >= colors.length) offset = 0
				}
			})
		}, 1000 / 5)
	})
})
