// Function to convert OCR output text to a structured JSON object
exports.convertOcrOutputToJson = function (ocrText) {
    // Define patterns for each field to be extracted from the OCR text
    const patterns = {
        dlNumber: /(?:DL|LIC\.? ?NO\.?|ID|DLN)\s*([A-Za-z0-9]+)(?=\s*[A-Z]+|\s*[:\r\n]|$)/i,
        firstName: /(?:FN|FIRST ?NAME)\s*([A-Za-z]+(?:\s[A-Za-z]+)*?)(?=\s*(?:DL|LIC\.? ?NO\.?|ID|DLN|DOB|D\.O\.B|ISSUANCE|ISSUED|ISSUE ?DATE|ISS|EXP|EXPIRATION ?DATE|EXPIRES|VALID ?THROUGH|LN|LAST ?NAME|ADDRESS|\r|\n|$))/i,
        lastName: /(?:LN|LAST ?NAME)\s*([A-Za-z]+(?:\s[A-Za-z]+)*?)(?=\s*(?:DL|LIC\.? ?NO\.?|ID|DLN|DOB|D\.O\.B|ISSUANCE|ISSUED|ISSUE ?DATE|ISS|EXP|EXPIRATION ?DATE|EXPIRES|VALID ?THROUGH|FN|FIRST ?NAME|ADDRESS|\r|\n|$))/i,
        dob: /(?:DOB|D\.O\.B)\s*([0-9]{2}[\/-][0-9]{2}[\/-][0-9]{4})(?=\s|[\r\n]|$)/i,
        issuanceDate: /(?:ISSUANCE|ISSUED|ISSUE ?DATE|ISS)\s*([0-9]{2}[\/-][0-9]{2}[\/-][0-9]{4})(?=\s|[\r\n]|$)/i,
        expirationDate: /(?:EXP|EXPIRATION ?DATE|EXPIRES|VALID ?THROUGH)\s*([0-9]{2}[\/-][0-9]{2}[\/-][0-9]{4})(?=\s|[\r\n]|$)/i,
        address: /ADDRESS\s*(([\d\w\s.#]*(?:\bSt\b|\bStreet\b|\bRd\b|\bRoad\b|\bAve\b|\bAvenue\b|\bBlvd\b|\bBoulevard\b|\bLane\b|\bLn\b|\bDrive\b|\bDr\b|\bCourt\b|\bCt\b|\bCircle\b|\bCir\b)(?:\s*(?:Apt|Unit|Bldg|#)?\s*\w+)?)),?\s*([\w\s]+),?\s*([A-Z]{2})\s*(\d{5})/i
    };

    // Initialize an object to hold the extracted data
    const data = {
        dlNumber: '',
        firstName: '',
        lastName: '',
        dob: '',
        issuanceDate: '',
        expirationDate: '',
        address: ''
    };

    // Iterate over each pattern and attempt to find a match in the OCR text
    Object.keys(patterns).forEach((key) => {
        const regex = patterns[key];
        const match = ocrText.match(regex);

        // If a match is found, process and store it in the corresponding field
        if (match) {
            // Special handling for addresses to concatenate parts with commas
            if (key === 'address') {
                data[key] = `${match[1].trim()}, ${match[3].trim()}, ${match[4]} ${match[5]}`;
            } else {
                // For other fields, join any captured groups with a space and trim the result
                data[key] = match.slice(1).filter(Boolean).join(' ').trim();
            }
        }
    });

    return data;
};

