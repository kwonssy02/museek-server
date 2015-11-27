var express = require('express');
var router = express.Router();
var jsonFormat = require('./jsonFormat');

require('./dbconnection')();

/**
 * 특정 아이디의 follow list의 post select
 * input  : userId
 * output : postId, userId, playlistId, content, regiDate, playlistName
 */
const selectPostsURL = ("/selectPosts/:userId");
const selectPostsQuery = ("SELECT B.postId postId, B.userId userId, B.playlistId playlistId, B.content content, B.regiDate regiDate, C.name playlistName \
                        FROM Follow A INNER JOIN Post B         \
                        ON A.followId = B.userId                \
                        INNER JOIN Playlist C                   \
                        ON B.playlistId = C.playlistId          \
                        WHERE A.userId = ?                      \
                        ORDER BY B.regiDate");

const selectCommentsQuery = ("SELECT C.commentId commentId, C.postId postId, C.userId userId, C.content content  \
                                FROM Follow A INNER JOIN Post B  \
                                ON A.followId = B.userId         \
                                INNER JOIN Comment C             \
                                ON B.postId = C.postId           \
                                WHERE A.userId = ?               \
                                ORDER BY C.commentId");

const selectSongsQuery = ("SELECT C.playlistId playlistId, C.songId songId, C.seq seq, D.title title, D.singer singer, D.duration duration \
                                FROM Follow A INNER JOIN Post B         \
                                ON A.followId = B.userId                \
                                INNER JOIN PlaylistSongs C              \
                                ON B.playlistId = C.playlistId          \
                                INNER JOIN Song D                       \
                                ON C.songId = D.songId                  \
                                WHERE A.userId = ?                      \
                                ORDER BY playlistId, C.seq");

router.get(selectPostsURL, selectPosts);
function selectPosts(req, res, next) {
        var userId = req.params.userId;
        var queryParams = [userId];
	connection.query(selectPostsQuery, queryParams, function(err, posts, fields) {
                if(err) {
                        throw err;
                }

                connection.query(selectCommentsQuery, queryParams, function(err, comments, fields) {
                       if(err) {
                                throw err;
                        }
                        connection.query(selectSongsQuery, queryParams, function(err, songs, fields) {
                                if(err) {
                                        throw err;
                                }
                                for(var i=0; i<posts.length; i++) {
                                        var postId = posts[i].postId;
                                        var playlistId = posts[i].playlistId;
                                        
                                        posts[i]['comments'] = [];
                                        for(var j=0; j<comments.length; j++) {
                                                if(postId == comments[j].postId) {
                                                        
                                                        posts[i]['comments'].push(comments[j]);
                                                }
                                        }
                                        
                                        posts[i]['songs'] = [];
                                        for(var k=0; k<songs.length; k++) {
                                                if(playlistId == songs[k].playlistId)
                                                        posts[i]['songs'].push(songs[k]);
                                        }
                                        
                                }
                                jsonFormat.successRes(res, 'selectPosts', posts);
                        });     
                });
        });
}


module.exports = router;
