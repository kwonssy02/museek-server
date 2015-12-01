var express = require('express');
var router = express.Router();
var jsonFormat = require('./jsonFormat');

require('./dbconnection')();

/**
 * 해당 곡을 유저 현재재생목록에 insert
 * input  : userId, songId
 * output : 없음
 */
const addSongToCurrentPlaylistURL = ("/addSongToCurrentPlaylist");
const selectSeqQuery = ("SELECT ifnull(MAX(seq), 0)+1 seq FROM PlaylistSongs WHERE playlistId = (SELECT min(playlistId) FROM Playlist where userId = ?)");
const addSongToCurrentPlaylistQuery = ("INSERT INTO PlaylistSongs                                                       \
                                        (                                                                               \
                                                playlistId                                                              \
                                                , songId                                                                \
                                                , seq                                                                   \
                                        )                                                                               \
                                        values                                                                          \
                                        (                                                                               \
                                                (SELECT min(playlistId) FROM Playlist where userId = ?)                 \
                                                , ?                                                                     \
                                                , ?                                                                     \
                                        );");


router.post(addSongToCurrentPlaylistURL, addSongToCurrentPlaylist);
function addSongToCurrentPlaylist(req, res, next) {
        var userId = req.body.userId;
        var songId = req.body.songId;

        var queryParams = [userId];
	connection.query(selectSeqQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                var seq = rows[0].seq;

                var queryParams2 = [userId, songId, seq];
                connection.query(addSongToCurrentPlaylistQuery, queryParams2, function(err, rows, fields) {
                        if(err) {
                                throw err;
                        }
                        jsonFormat.successRes(res, 'addSongToCurrentPlaylist', req.body);
                });

        });

}


router.post('/', function(req, res) {
	res.send();
});

module.exports = router;
