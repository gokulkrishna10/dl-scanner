const extractImageDataController = require('../controllers/dlScannerController')

exports.extractImageData = function (req, res) {
    extractImageDataController.extractImageData(req, (err, response) => {
        if (err) {
            res.status(err.code ? err.code : 500).send(err)
        } else {
            res.status(200).send(response)
        }
    })
}