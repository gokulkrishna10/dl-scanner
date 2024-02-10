const tesseracts = require('node-tesseract-ocr');
const dlScannerHelperMapper = require('../helpers/dlScannerHelper')

exports.extractImageData = function (req, callback) {
    const tesseractsConfig = {
        lang: 'eng',
        oem: 1,
        psm: 3,
    };
    tesseracts.recognize(req.file.path, tesseractsConfig)
        .then(text => {
            let licenseInfoObject = dlScannerHelperMapper.convertOcrOutputToJson(text)
            callback(null, licenseInfoObject)
        })
        .catch(err => {
            console.log(err.message)
            callback(err, null)
        })
}
