export interface PropertiesService {
	setBrightness(percentage: number): Promise<void>

	getBatteryLevel(): Promise<number | null>

	getFirmwareVersion(): Promise<string>

	getSerialNumber(): Promise<string>
}
