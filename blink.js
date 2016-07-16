var five = require('johnny-five');
var ChipIO = require('chip-io');

var board = new five.Board({
  io: new ChipIO(),
  repl:false
});

board.on('ready', function() {
// do Johnny-Five stuff
    var self = this;
   this.pinMode(53,five.Pin.OUTPUT);
   this.digitalWrite(53,1);
   setTimeout(function(){
     self.digitalWrite(53,0);
    console.log(self);
   console.log(self===board);
   console.log(board.isConnected);  
  process.exit(0);   
	},800);
});



