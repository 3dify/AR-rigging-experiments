#!/usr/bin/env node
var child_process = require('child_process');
//var spawnSync = require('spawn-sync');
var path = require('path');
var fs = require('fs');
var gm = require('gm');
var AdmZip = require('adm-zip');
var md5 = require('MD5');
var qr = require('qr-image');
var ftp = require('ftp');
var request = require('sync-request');
var crypto = require('crypto-md5');


// REWORK HERE

// load module
var vuforia = require('vuforiajs');

// init client with valid credentials
var client = vuforia.client({

    // provision_access_key
    'accessKey': '82fbdd38486d11e9cdcfa1db5ce1c16a0f88a63c',

    // server_secret_key
    'secretKey': '0ec60fbfe5e60f731baa402d31d32c1700d40f00'
});

// util for base64 encoding and decoding
var util = vuforia.util();


// END REWORK

var config = require('./config.js');

var expectedArgs = 4;
var cwd = process.cwd();
var basePath = path.normalize(path.join(__dirname,config.basePath));
var scriptsPath = path.normalize(__dirname);
var unityProjectPath = path.join(basePath,config.unityProjectPath);
var unityModelPath = path.join(unityProjectPath,config.unityAssetPath,config.unityModelPath);
var unityModelPathRelative = path.join(config.unityModelPath);

var exitWithError = function(msg){
	process.stderr.write(msg+"\n");
	process.exit(1);
}

if( process.argv[0] != 'node' )
{
	expectedArgs--;
}



if( process.argv.length != expectedArgs ){
	exitWithError("missing arguments\nusage: main.js {asset_dir} {output_dir}");
}


var assetDir = path.normalize(process.argv[2]);
var assetName = path.basename(assetDir);
var outputParent = path.join(cwd, path.normalize(process.argv[3]) );
var outputDir = path.join(cwd, path.normalize(process.argv[3]), assetName );
//Load json config file


if( !fs.existsSync(outputDir) ){
	fs.mkdirSync(outputDir);
} else if( !fs.statSync(outputDir).isDirectory() ){
	exitWithError('Error output dir name exists as file '+outputDir);
}

var fileList=fs.readdirSync(assetDir);

//Convert png to jpg

var pngFiles = fileList.filter(function(e){ return e.substr(-4).toLowerCase() == '.png' });
var jpgFiles = [];

if( pngFiles.length == 0 ){
	exitWithError('no png files found in '+assetDir);
}

var imagesLeftToSave=0;
pngFiles.forEach(function(imageFile){
	outFile = path.join(outputDir,imageFile.substr(0,imageFile.length-4)+".jpg");
	imagesLeftToSave++;
	
	console.log("==>>"+path.join(assetDir,imageFile));
	//writeFileSync(outFile,gm(path.join(assetDir,imageFile)).compress('JPEG').quality(config.textureQuality).toBuffer());
	gm(path.join(assetDir,imageFile)).compress('JPEG').thumb(config.textureSize,config.textureSize,outFile,config.textureQuality,function(err){
		if(err)exitWithError('failed to save '+outFile);
		imagesLeftToSave--;
	});

	jpgFiles.push(outFile);

});


//Decimate mesh

var objFile = fileList.filter( function(e){ return e.substr(-4).toLowerCase() == '.obj' })[0];
var binFilePath = path.normalize(path.join(outputDir,"model.bin"));

if( !objFile ){
	exitWithError('no obj file found in '+assetDir);
}

var decimateCmd = scriptsPath+"/blender";
var decimateArgs = [
	"-P",scriptsPath+"/decimate.py",
	"-b",config.emptyBlend,
	"--",
	assetDir,
	unityModelPath,
	Number(config.numOfPolys).toString()
];

console.log("executing decimate:\n"+decimateCmd+" "+decimateArgs.join(" "));
child = child_process.spawnSync(decimateCmd,decimateArgs);

if(child.status>0){	
	exitWithError(child.stderr.toString());
}

//Create binary model file from Unity

config.unityProjectPath = path.normalize(unityProjectPath);

var makeModelArgs = [
	"-batchmode",
	"-projectPath",config.unityProjectPath,
	"-quit",
	"-executeMethod","MakeBundle.BundleCommandLine",
	"-logFile",path.normalize(path.join(basePath,config.unityLogPath)),
	"-3dify-bundle-files",path.normalize(path.join(unityModelPathRelative,objFile)),
	"-3dify-bundle-output",binFilePath
];
var makeBinModelCmd = config.unityExecutablePath;
console.log("constructing binary model file:\n"+makeBinModelCmd);
child = child_process.spawnSync(makeBinModelCmd,makeModelArgs);

if(child.status>0){
	exitWithError(child.stderr.toString());
}


var waitForSave=setInterval(function(){
	if(imagesLeftToSave==0){
		saveZipAndUpload();
		clearInterval(waitForSave);
	}
},40);

var saveZipAndUpload = function(){
	//Create zip file
	console.log('creating zip file');
	var d = new Date();
	var timestamp = [d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds()].join('');
	var zipFile = assetName+"-"+(timestamp)+".zip";
	var zipFilePath = path.join(outputParent,zipFile);
	var remoteZipFile = md5(zipFile);
	var remoteZipPath = path.join(config.ftp.path,remoteZipFile);
	var zipFileUrl = 'http://3dify.co.uk/scans/'+remoteZipFile;

	/*
	var zip = new AdmZip();
	zip.addLocalFile( binFilePath, '');
	jpgFiles.forEach(function(file){
		zip.addLocalFile(file,'');
	});
	
	zip.writeZip(zipFilePath);
	*/

	child = child_process.spawnSync('zip',['-rj',zipFilePath,outputDir]);
	
	if(child.status>0){
		exitWithError(child.stderr.toString());
	}

	//FTP Upload zip
	console.log('ftp uploading zip file');
	var ftpConnection = new ftp();
	ftpConnection.on('ready', function() {
	    ftpConnection.put(zipFilePath, remoteZipPath, function(err) {
	      if (err){
	      		exitWithError(err.toString());
	      }
	      ftpConnection.end();
	    });
	  });
	ftpConnection.connect(config.ftp);

	//Generate QR Code
	var qrImagePath = path.join(outputParent,assetName+".png");
	console.log('creating qr code');
	var qrPng = qr.imageSync(zipFileUrl, { type: 'png' });
	fs.writeFileSync(qrImagePath,qrPng);

	child = child_process.spawnSync('open',['-a','Preview',qrImagePath]);
	if(child.status>0){
		exitWithError(child.stderr.toString());
	}

	console.log(zipFileUrl+" copied to clipboard");
	child = child_process.execSync('echo "'+zipFileUrl+'" | pbcopy');

	//Submit QR Code to Vuforia



//REWORK
console.log(qrImagePath);

var target = {

    // name of the target, unique within a database
    'name': remoteZipFile,
    // width of the target in scene unit
    'width': 1,
    // the base64 encoded binary recognition image data
    'image': util.encodeFileBase64(qrImagePath),
    // indicates whether or not the target is active for query
    'active_flag': true,
    // the base64 encoded application metadata associated with the target
    'application_metadata': util.encodeBase64(assetName)
};

// END REWORK


client.addTarget(target, function (error, result) {

    if (error) { // e.g. [Error: AuthenticationFailure]

        console.error(result);
        /* result would look like
         {
            result_code: 'AuthenticationFailure',
            transaction_id: '58b51ddc7a2c4ac58d405027acf5f99a'
         }
         */

    } else {

        console.log(result);
        /* result will look like
         {
            target_id: '93fd6681f1r74b76bg80tf736a11b6a9',
            result_code: 'TargetCreated',
            transaction_id: 'xf157g63179641c4920728f1650d1626'
         }
         */
    }
});


	

	


}


