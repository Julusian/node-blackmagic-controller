/* eslint-disable n/no-extraneous-import */
// @ts-check

import fs from 'node:fs/promises'

import { UdevRuleGenerator } from 'udev-generator'
import { DEVICE_MODEL_INFO } from '@blackmagic-controller/core'

const generator = new UdevRuleGenerator()

for (const model of Object.values(DEVICE_MODEL_INFO)) {
	for (const match of model.usb) {
		generator.addDevice(match.vendorId, match.productId)
	}
}

const headlessStr = generator.generateFile({
	mode: 'headless',
})
const desktopStr = generator.generateFile({
	mode: 'desktop',
})

const rulesJSON = JSON.stringify(generator.rules, undefined, '\t')

await fs.writeFile(new URL('../packages/node/udev/50-blackmagic-panel-user.rules', import.meta.url), desktopStr, 'utf8')
await fs.writeFile(
	new URL('../packages/node/udev/50-blackmagic-panel-headless.rules', import.meta.url),
	headlessStr,
	'utf8',
)

await fs.writeFile(new URL('../packages/web/udev/50-blackmagic-panel-user.rules', import.meta.url), desktopStr, 'utf8')

await fs.writeFile(new URL('../packages/node/udev-generator-rules.json', import.meta.url), rulesJSON, 'utf8')
await fs.writeFile(new URL('../packages/web/udev-generator-rules.json', import.meta.url), rulesJSON, 'utf8')

console.log('Udev rules regenerated successfully!')
