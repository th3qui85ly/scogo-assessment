module.exports = (req, res, next) => {
    if(req.user == undefined) {
        res.status(404).send({ url: req.originalUrl + ' couldn\'t be reached! Check login again!' })
    } else {
        next();
    }
};