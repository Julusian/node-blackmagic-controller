export interface PropertiesService {
	getBatteryLevel(): Promise<number | null>

	getBatteryCharging(): Promise<boolean | null>

	getFirmwareVersion(): Promise<string>

	getSerialNumber(): Promise<string>

	setJogMode(mode: number): Promise<void>
}
