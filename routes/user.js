var express = require('express');
var router = express.Router();
var jsonFormat = require('./jsonFormat');

require('./dbconnection')();

/**
 * 유저 패스워드 체크
 * input  : userId, password
 * output : NULL(일치하는 결과 없을 때), User(일치하는 결과 있을 때)
 */
const checkPasswordURL = ("/checkPassword/:userId/:password");
const checkPasswordQuery = ("SELECT userId, name, phone FROM User WHERE userId = ? and password = password(?)");

router.get(checkPasswordURL, checkPassword);
function checkPassword(req, res, next) {
	var userId = req.params.userId;
	var password = req.params.password;
	var queryParams = [userId, password];
	connection.query(checkPasswordQuery, queryParams, function(err, rows, fields) {
                if(err) {
                        throw err;
                }
                jsonFormat.successRes(res, 'checkPassword', rows);
        });
}

router.post('/', function(req, res) {
	res.send();
});

module.exports = router;
