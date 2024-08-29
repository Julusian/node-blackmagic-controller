export function uint8ArrayToDataView(buffer: Uint8Array | Uint8ClampedArray): DataView {
	return new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
}
