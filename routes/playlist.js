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


const getPlaylistsByIdURL = ("/getPlaylistsById/:userId");
const selectPlaylistsByIdQuery = ("SELECT playlistId, name, userId, regiDate FROM Playlist where userId = ? ORDER BY playlistId asc");
const selectPlaylistSongsQuery = ("SELECT B.playlistId playlistId, B.songId songId, B.seq seq, C.title title, C.singer singer, C.duration duration \
                                FROM Playlist A INNER JOIN PlaylistSongs B              \
                                ON A.playlistId = B.playlistId                          \
                                INNER JOIN Song C                                       \
                                ON B.songId = C.songId                                  \
                                where userId = ?                                        \
                                ORDER BY B.playlistId asc, B.seq desc");

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

router.get(getPlaylistsByIdURL, getPlaylistsById);
function getPlaylistsById(req, res, next) {
        var userId = req.params.userId;
        var queryParams = [userId];
        connection.query(selectPlaylistsByIdQuery, queryParams, function(err, playlists, fields) {
                if(err) {
                        throw err;
                }
                
                var queryParams2 = [userId];
                connection.query(selectPlaylistSongsQuery, queryParams2, function(err, songs, fields) {
                        if(err) {
                                throw err;
                        }

                        for(var i=0; i<playlists.length; i++) {
                                var playlistId = playlists[i].playlistId;
                                playlists[i]["songs"] = [];
                                for(var j=0; j<songs.length; j++) {
                                        if(songs[j].playlistId == playlistId) {
                                               playlists[i]["songs"].push(songs[j]);
                                        }
                                }
                        }
                        //playlists
                        jsonFormat.successRes(res, 'getPlaylistsById', playlists);
                });
        });
}


router.post('/', function(req, res) {
	res.send();
});

module.exports = router;
