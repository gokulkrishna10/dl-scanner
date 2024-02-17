const dlScannerHelperMapper = require('../helpers/dlScannerHelper')
const {spawn} = require('child_process');
const path = require('path');


exports.extractImageData = async function (req, callback) {
    try {
        // Construct the absolute path to the Python script
        const scriptPath = path.join(__dirname, '../src/python/extract_text.py');

        // Spawn a Python process to run the OCR script with the image file path as an argument
        const pythonProcess = await spawn('python', [scriptPath, req.file.path]);

        // Listen for data event from the Python process stdout stream
        let outputData = {}
        pythonProcess.stdout.on('data', (data) => {
            console.log(`Extracted Text: ${data}`);
            const dataStr = data.toString();

            // Use a regular expression to extract the JSON string that represents the extracted text
            const matches = dataStr.match(/\{"extractedText":.*?\}/);
            if (matches) {
                const jsonPart = matches[0];
                console.log(`JSON Part: ${jsonPart}`);
                try {
                    // Parse the JSON string to an object
                    const result = JSON.parse(jsonPart);

                    // Call a helper function to map the OCR output to a desired format
                    outputData = dlScannerHelperMapper.convertOcrOutputToJson(result.extractedText)
                    console.log(outputData)
                } catch (e) {
                    // Log errors if JSON parsing fails
                    console.error("Error parsing JSON:", e);
                }
            }
        });

        // Listen for data event from the Python process stderr stream
        pythonProcess.stderr.on('data', (data) => {
            // Log any errors that occur during the execution of the Python script
            console.error(`Error inside stderr dao : ${data}`);
        });

        // Listen for the close event of the Python process
        pythonProcess.on('close', (code) => {
            // Log the exit code of the Python process
            console.log(`Child process exited with code ${code}`);
            callback(null, outputData)
        });
    } catch (e) {
        // Log any errors that occur during the setup or execution of the Python process
        console.log("Inside the catch block. Something failed : ", e)
    }
}
