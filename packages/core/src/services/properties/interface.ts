export interface PropertiesService {
	getBatteryLevel(): Promise<number | null>

	getFirmwareVersion(): Promise<string>

	getSerialNumber(): Promise<string>
}
