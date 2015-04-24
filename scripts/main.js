#!/usr/bin/env node

var child_process = require('child_process');
var path = require('path');
var fs = require('fs');
var gm = require('gm');
var AdmZip = require('adm-zip');
var qr = require('qr-image');
var ftp = require('ftp');
var md5 = require('MD5');

var config = require('./config.js');

var expectedArgs = 4;
var cwd = process.cwd();
var basePath = path.normalize(path.join(__dirname,config.basePath));
var scriptsPath = path.normalize(__dirname);
var unityProjectPath = path.join(basePath,config.unityProjectPath);
var unityModelsPath = path.join(unityProjectPath,config.unityModelsPath);

console.log(basePath);
console.log(scriptsPath);
var exitWithError = function(msg){
	process.stderr.write(msg);
	process.exit(1);
}

if( process.argv[0] != 'node' )
{
	expectedArgs--;
}

if( process.argv.length != expectedArgs ){
	exitWithError("missing arguments\nusage: main.js {asset_dir} {output_dir} \n");
}


var assetDir = path.normalize(process.argv[2]);
var outputDir = cwd;
var assetName = path.basename(assetDir);
outputDir = path.join(outputDir,assetName)


//Load json config file

if( !fs.existsSync(outputDir) ){
	fs.mkdirSync(outputDir);
} else if( fs.statSync(outputDir).isDirectory() ){
	exitWithError('Error output dir name exists as file');
}

console.log(assetDir);
console.log(assetName);

var fileList=fs.readdirSync(assetDir);

//Convert png to jpg

var pngFiles = fileList.filter(function(e){ e.substr(4).toLowerCase() == '.png' });
var jpgFiles = [];
console.log(fileList);
console.log(pngFiles);

if( pngFiles.length == 0 ){
	exitWithError('no png files found in '+assetDir);
}

pngFiles.forEach(function(imageFile){
	outFile = path.join(outputDir,imageFile.substr(0,imageFile.length-4)+".jpg");

	gm(path.join(assetDir,imageFile)).compress('JPEG').thumb(config.textureSize,config.textureSize,outFile,70,function(){
		exitWithError('failed to save '+outFile);
	});

	jpgFiles.push(outFile);

});


//Decimate mesh

var objFile = fileList.filter(function(e){ e.substr(4).toLowerCase() == '.obj' })[0];
var binFilePath = path.normalize(path.join(unityModelsPath,"model.obj"));

if( !objFile ){
	exitWithError('no obj file found in '+assetDir);
}

var decimateCmd = scriptsPath+"/blender -P "+scriptsPath+"/decimate.py -b \""+config.emptyBlend+"\" -- \""+assetDir+"\" \""+unityModelsPath+"\" "+Number(config.numOfPolys).toString();
console.log("executing decimate:\n"+decimateCmd);
child = child_process.spawnSync(decimateCmd);
if(child.error>0){
	exitWithError(stderr.toString());
}

//Create binary model file from Unity

config.unityProjectPath = path.normalize(unityProjectPath);

var makeModelArgs = [
	"-batchmode",
	"-projectPath "+config.unityProjectPath,
	"-quit",
	"-executeMethod MakeBundle.BundleCommandLine",
	"-logFile "+path.normalize(config.unityLogPath),
	"-3dify:bundle-files "+path.normalize(path.join(unityModelsPath,objFile)),
	"-3dify:bundle-output "+binFilePath
];
var makeBinModelCmd = unityExecutablePath+makeModelArgs.join(' ');
console.log("executing decimate:\n"+makeBinModelCmd);
child = child_process.spawnSync(makeBinModelCmd);

if(child.error>0){
	exitWithError(stderr.toString());
}


//Create zip file

var zipFile = assetName+"-"+(new Date().toISOString())+".zip";
var zipFilePath = path.join(cwd,zipFile);
var remoteZipFile = md5(zipFile);
var remoteZipPath = path.join(config.ftp.path,remoteZipFile);
var zip = new AdmZip();
zip.addLocalFile( binFilePath );
jpgFiles.each(zip.addLocalFile.bind(zip));
zip.writeZip(zipFilePath);


//FTP Upload zip

var ftpConnection = new ftp();
ftpConnection.on('ready', function() {
    c.put(zipFilePath, remoteZipPath, function(err) {
      if (err){
      		exitWithError(err.toString());
      }
      c.end();
    });
  });
ftpConnection.connect(config.ftp);

//Generate QR Code
var qrImagePath = path.join(cwd,assetName+".png");
var qrPng = qr.image('http://3dify.co.uk/scans/'+remoteZipFile, { type: 'png' });
qrPng.pipe(fs.createWriteStream());

child = child_process.spawnSync('open -a Preview '+qrImagePath);



