//===============================================
// Require npm packages
//===============================================

const path = require('path');

// Define Routes in exported function
module.exports = function(app) {

    // home (index.html).
    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });

    // saved articles (savedArticles.html).
    app.get('/savedArticles', function(req, res) {
        res.sendFile(path.join(__dirname, '../public', 'savedArticles.html'));
      });

}; // END OF exported module