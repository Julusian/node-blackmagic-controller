export interface PropertiesService {
	// setBrightness(percentage: number): Promise<void>

	getFirmwareVersion(): Promise<string>

	getSerialNumber(): Promise<string>
}
