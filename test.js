// see https://gist.github.com/natevw/5789019 for pins

var NRF24 = require("./index"),
    spiDev = "/dev/spidev0.0",
    cePin = 24, irqPin = 25;

var nrf = NRF24.connect(spiDev, cePin, irqPin);
nrf.printDetails();
nrf._debug = true;

//nrf.reset(function () {});
//var ce = require("./gpio").connect(cePin),


var pipes = [0xF0F0F0F0E1, 0xF0F0F0F0D2];


var stream = require('stream'),
    util = require('util');

function TimeStream(ms) {
    stream.Readable.call(this);
}
util.inherits(TimeStream, stream.Readable);
TimeStream.prototype._read = function () {
    this.push(new Date().toISOString());
};

setTimeout(function () {
    function _nop() {};
    nrf.channel(0x4c, _nop).dataRate('1Mbps', _nop).crcBytes(2,_nop).mode('tx', function () {
        var tx = nrf.openPipe(pipes[0]);
        tx.on('ready', function () {
            (new TimeStream).pipe(tx);
        });
    });
}, 1e3);      // HACK: wait for printDetails to finish
