var express = require('express');
var router = express.Router();
var jsonFormat = require('./jsonFormat');

require('./dbconnection')();

/**
 * 전체 song정보 select
 * input  : 없음
 * output : songId, fileSize, duration, title, singer, regiDate
 */
const selectSongsURL = ("/selectSongs");
const selectSongsQuery = ("SELECT songId, fileSize, duration, title, singer, regiDate FROM Song;");

/**
 * title로 노래 검색 
 * input  : title
 * output : songId, fileSize, duration, title, singer, regiDate
 */
const searchSongsByTitleURL = ("/searchSongsByTitle/:title");
const searchSongsByTitleQuery = ("SELECT songId, fileSize, duration, title, singer, regiDate FROM Song WHERE title LIKE CONCAT('%', ?, '%');");

/**
 * singer로 노래 검색 
 * input  : singer
 * output : songId, fileSize, duration, title, singer, regiDate
 */
const searchSongsBySingerURL = ("/searchSongsBySinger/:singer");
const searchSongsBySingerQuery = ("SELECT songId, fileSize, duration, title, singer, regiDate FROM Song WHERE singer LIKE CONCAT('%', ?, '%');");

router.get(selectSongsURL, selectSongs);
function selectSongs(req, res, next) {
	connection.query(selectSongsQuery, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                jsonFormat.successRes(res, 'selectSongs', rows);
        });
}

router.get(searchSongsByTitleURL, searchSongsByTitle);
function searchSongsByTitle(req, res, next) {
	var title = req.params.title;
	var queryParams = [title];
        connection.query(searchSongsByTitleQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                jsonFormat.successRes(res, 'searchSongsByTitle', rows);
        });
}

router.get(searchSongsBySingerURL, searchSongsBySinger);
function searchSongsBySinger(req, res, next) {
        var singer = req.params.singer;
        var queryParams = [singer];
        connection.query(searchSongsBySingerQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                jsonFormat.successRes(res, 'searchSongsBySinger', rows);
        });
}

router.post('/', function(req, res) {
	res.send();
});

module.exports = router;
