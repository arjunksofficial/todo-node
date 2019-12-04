module.exports = function (app) {

    app.get('/', function (req, res) {
        res.sendFile('login.html', {root: __dirname+'/../webpages'});
    });
}