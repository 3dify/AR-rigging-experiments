
var AdmZip = require('adm-zip');
var fs = require('fs');
/*
var zip = new AdmZip();
	
//zip.addLocalFolder(outputDir, './');

//zip.addLocalFile( 'scripts/main.js', '');
zip.addLocalFile( 'obj_texture_uv_207000/model.jpg', '');

//zip.addLocalFile( 'obj_texture_uv_207000/model.jpg', '');
//zip.addLocalFile( 'obj_texture_uv_207000/model.bin', '');

zip.writeZip('test.zip');
*/

var zip = new AdmZip();

    // add file directly
    zip.addFile("test.txt", new Buffer("inner content of the file"), "entry comment goes here");
    // add local file
    zip.addLocalFile("obj_texture_uv_207000/model.jpg");
    // get everything as a buffer
    var willSendthis = zip.toBuffer();
    // or write everything to disk
    //zip.writeZip(/*target file name*/"test.zip");
    fs.writeFileSync('test.zip',willSendthis,{encoding:'binary'});
