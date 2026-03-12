const fs = require('fs');

const data = fs.readFileSync('/app/applet/src/assets/biensante-logo.png');
console.log('Local logo size:', data.length);
