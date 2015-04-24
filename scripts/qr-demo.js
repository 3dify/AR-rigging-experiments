var qr = require('qr-image');
var fs = require('fs');

var qr_svg = qr.image('I love QR!', { type: 'svg' });
qr_svg.pipe(fs.createWriteStream('i_love_qr.svg'));
 
var svg_string = qr.imageSync('I love QR!', { type: 'svg' });