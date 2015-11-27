var express = require('express');
var router = express.Router();
var jsonFormat = require('./jsonFormat');

require('./dbconnection')();

/**
 * 전체 song정보 select
 * input  : 없음
 * output : id, password, name, groupkey
 */
 /*
const selectSongsURL = ("/songs");
const selectSongsQuery = ("SELECT * FROM Song;");

router.get(selectSongsURL, selectSongs);
function selectSongs(req, res, next) {
	connection.query(selectSongsQuery, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                jsonFormat.successRes(res, 'selectSongs', rows);
        });
}
*/
router.post('/', function(req, res) {
	res.send();
});

module.exports = router;
