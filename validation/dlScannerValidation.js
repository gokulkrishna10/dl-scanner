const ErrorMod = require('../customnodemodules/error_node_module/errors')
const customError = new ErrorMod()


exports.validateExtractImageData = function (req, res, next) {
    let err = null

    // check if req has files
    if (!req.file) {
        err = customError.BadRequest('No file was uploaded.');
        next(err)
    } else {
        console.log('The file ', req.file, ' is available in req.file');
        next()
    }
}

