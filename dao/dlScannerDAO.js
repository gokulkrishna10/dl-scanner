const dlScannerHelperMapper = require('../helpers/dlScannerHelper')
const {spawn} = require('child_process');
const path = require('path');


exports.extractImageData = async function (req, callback) {
    try {
        console.log("inside dao")
        const scriptPath = path.join(__dirname, '../src/python/extract_text.py');
        console.log("scriptPath is - ", scriptPath)
        const pythonProcess = await spawn('python', [scriptPath, req.file.path]);
        console.log("python process selected inside dao")

        let outputData = {}
        pythonProcess.stdout.on('data', (data) => {
            console.log(`Extracted Text: ${data}`);
            const dataStr = data.toString();
            console.log('--------->converted to string <------------ ', dataStr)
            // Use a regular expression to find the JSON part in the output
            const matches = dataStr.match(/\{"extractedText":.*?\}/);
            console.log('--------->match completed <------------  ', matches)
            if (matches) {
                const jsonPart = matches[0];
                console.log(`JSON Part: ${jsonPart}`);
                try {
                    const result = JSON.parse(jsonPart);
                    // call the helper function to map the output fields
                    outputData = dlScannerHelperMapper.convertOcrOutputToJson(result.extractedText)
                    console.log(outputData)
                } catch (e) {
                    console.error("Error parsing JSON:", e);
                }
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.log("inside stderr dao")
            console.error(`Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Child process exited with code ${code}`);
            callback(null, outputData)
        });
    } catch (e) {
        console.log("Inside the catch block. Something failed : ", e)
    }
}

// try {
//     // Preprocess the image
//
//     // Use path.basename() to extract the filename from the full path
//     const originalImageName = path.basename(req.file.path);
//
//     // Prefix the original filename with 'preprocessed-'
//     const preprocessedImageName = `preprocessed-${originalImageName}`;
//
//     // Construct the full path for the preprocessed image in the 'uploads' directory
//     const preprocessedImagePath = path.join(__dirname, '../uploads', preprocessedImageName);
//     preprocessImage(req.file.path, preprocessedImagePath)
//         .then(() => {
//             const tesseractsConfig = {lang: 'eng', oem: 1, psm: 3};
//             tesseracts.recognize(req.file.path, tesseractsConfig)
//                 .then(text => {
//                     console.log("Result : ", text)
//                     let licenseInfoObject = dlScannerHelperMapper.convertOcrOutputToJson(text)
//                     callback(null, licenseInfoObject)
//                 })
//                 .catch(err => {
//                     console.log(err.message)
//                     callback(err, null)
//                 })
//         })
//         .catch(error => {
//             console.log("Something failed : ", error)
//         })
//         .finally(() => {
//             console.log("Preprocessing completed")
//         });
//
// } catch (error) {
//     console.log(error)
// }

// const preprocessImage = (inputPath, outputPath) => {
//     return sharp(inputPath)
//         .grayscale() // Convert to grayscale
//         .resize(800) // Resize to a width of 800 pixels while maintaining aspect ratio
//         .sharpen() // Sharpen the image
//         .threshold(135) // Apply thresholding to make the image more OCR-friendly
//         .toFile(outputPath); // Save the preprocessed image
// };

