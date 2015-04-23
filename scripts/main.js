#!/usr/bin/env node

var child_process = require('child_process');
var path = require('path');
var fs = require('fs');
var gm = require('gm');
var config = require('./config.js');
var expectedArgs = 4;

if( process.argv[0] != 'node' )
{
	expectedArgs--;
}

if( process.argv.length != expectedArgs ){
	process.stderr.write("missing arguments\nusage: main.js {asset_dir} {output_dir} \n");
	process.exit(1);
}

var assetDir = path.normalize(process.argv[2]);
var outputDir = path.normalize(process.argv[3]);
var assetName = path.basename(assetDir);
outputDir = path.join(outputDir,assetName)


//Load json config file

if( !fs.existsSync(outputDir) ){
	fs.mkdirSync(outputDir);
} else if( fs.statSync(outputDir).isDirectory() ){
	process.exit('Error output dir name exists as file');
}

console.log(assetDir);
console.log(assetName);

//Convert png to jpg

var fileList=fs.readdirSync(assetDir);
var pngFiles = fileList.filter(function(e){ e.substr(4).toLowerCase() == '.png' });

console.log(fileList);
console.log(pngFiles);

pngFiles.forEach(function(imageFile){
	outFile = path.join(outputDir,imageFile.substr(0,imageFile.length-4)+".jpg");

	gm(path.join(assetDir,imageFile)).compress('JPEG').thumb(1<<10,1<<10,outFile,70,function(){
		process.quit('failed to save '+outFile);
	});

});




//Decimate mesh
//./scripts/blender -P scripts/decimate.py -b Assets/Models/empty.blend -- ~/Dropbox/models_for_rigging/obj_texture_uv_207000/ Assets/Models 40000
child = child_process.spawnSync();

//Create binary model file from Unity

//Create zip file

//FTP Upload zip


//Generate QR Code
