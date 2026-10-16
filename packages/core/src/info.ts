export type KeyId = string

export enum BlackmagicControllerModelId {
	AtemMicroPanel = 'atem-micro-panel',
	DaVinciResolveReplayEditor = 'davinci-resolve-replay-editor',
	DaVinciResolveSpeedEditor = 'davinci-resolve-speed-editor',
}

export interface Dimension {
	width: number
	height: number
}
