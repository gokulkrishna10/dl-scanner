const extractImageDataDa0 = require('../dao/dlScannerDAO')

exports.extractImageData = function (req, callback) {
    extractImageDataDa0.extractImageData(req, (err, result) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, result)
        }
    })
}