//===============================================
// Require npm packages
//===============================================

const path = require('path');

module.exports = function(app) {
    // home (index.html).
    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });

    app.get('/savedArticles', function(req, res) {
        res.sendFile(path.join(__dirname, '../public', 'savedArticles.html'));
      });
};