function decodeData(hexData) {
    const stripHexPrefix = hexData.startsWith('0x') ? hexData.slice(2) : hexData;
    const dataBuffer = Buffer.from(stripHexPrefix, 'hex');

    // Helper function to read a section of the buffer as a BigInt
    function readBigInt(offset, length = 32) {
        return BigInt('0x' + dataBuffer.slice(offset, offset + length).toString('hex'));
    }

    // Helper function to read a string from the buffer
    function readString(offset) {
        const stringLength = Number(readBigInt(offset)); // First 32 bytes indicate the string length
        return dataBuffer.slice(offset + 32, offset + 32 + stringLength).toString('utf-8');
    }

    // Helper function to read an Ethereum address
    function readAddress(offset) {
        return '0x' + dataBuffer.slice(offset + 12, offset + 32).toString('hex'); // Skip 12 bytes of padding
    }

    // Decode the fixed value
    const value = readBigInt(0).toString();

    // Decode dynamic data. First, find the offset where the data starts.
    const targetsNamesOffset = Number(readBigInt(96)) + 32; // The offset is at position 96 (3rd position), +32 to move past the length
    const targetsNames = readString(targetsNamesOffset);

    // Decoding addresses requires knowing the exact offset
    const targetsOffset = 256; // Adjusted based on the structure
    const targets = readAddress(targetsOffset);

    // Event names are dynamic; find the offset and decode
    const eventNamesOffset = Number(readBigInt(352)) + 32; // Adjusted based on the structure
    const eventNames = readString(eventNamesOffset);

    // Event params can be complex and vary; this example simplifies by assuming we're just reading a hex string directly
    const eventParamsOffset = 416; // Starting point for event parameters
    const eventParams = dataBuffer.slice(eventParamsOffset).toString('hex');

    console.log({
        value,
        targetsNames,
        targets,
        eventNames,
        eventParams
    });
}

// The provided hex data
const hexData = "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c556e697377617056332d763100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000593d4f490736933a88f4ccd89124c3be8deca9380000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000344c6f674d696e742875696e743235362c75696e743235362c75696e743235362c75696e743235362c696e7432342c696e743234290000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000011f00100000000000000000000000000000000000000000000000000000015a99832e500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e20fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffbad84fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffbc242";
decodeData(hexData);