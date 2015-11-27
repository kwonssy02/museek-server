var fs = require('fs');
//var Busboy = require('busboy');
var path = require('path');
 
module.exports = function(app) {
 
	//app.use(Busboy({immediate:true})); 
	app.get('/uploadTest',function(req,res){
		res.send(
		'<form action="/upload" method="post" enctype="multipart/form-data">'+
      		'<input type="file" name="userfile">'+
      		'<input type="submit" value="Upload">'+
      		'</form>'
		); 
	});

	app.post('/upload', function(req, res) {
		//var busboy = new Busboy({ headers: req.headers });
		console.log('upload goes');
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			console.log('file:'+filename);
			var dirname = ".";
			//var dirname = "..";
			var newPath = dirname + "/uploads/";
			//var saveTo = path.join(newPath, path.basename(fieldname));
			var saveTo = dirname + "/uploads/" + filename;
			
			file.pipe(fs.createWriteStream(saveTo,{flags: 'w'}));
		});	
			
		req.busboy.on('finish', function() {
			res.writeHead(200, { 'Response' : 'Saved' });
			res.end("That's all folks!");
		});
		
		return req.pipe(req.busboy);
		//res.writeHead(404);
		//res.end();
	});
 
	app.get('/uploads/:file', function (req, res){
    	file = req.params.file;
    	var dirname = ".";
		// var mp3File = fs.readFileSync(dirname + "/uploads/" + file);
  //   	res.writeHead(200, {'Content-Type': 'audio/mp3', "Content-Length": mp3File.length});
		// res.end(mp3File, 'binary');
		var stat = fs.statSync(dirname + "/uploads/" + file);
		res.writeHead(200, {
			'Content-Type': 'audio/mpeg',
			'Content-Length': stat.size
		});

		var readStream = fs.createReadStream(dirname + "/uploads/" + file);
		readStream.pipe(res);
		
	});
};
