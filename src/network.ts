///<reference path="../typings/socket.io/socket.io.d.ts"/>
import io = require("socket.io");

//IS THIS WORTH IT? Scope issues with callbacks on 'on'
class Network {
	socket: any;
	
	constructor() { 		
		this.socket = io.connect(); //How can this be.. better?
	}
	
	on(event: string, callback: (data: any) => void) {
		this.socket.on(event, callback);
	}
	
	emit(event: string, data: any) {
		this.socket.emit(event, data);
	}
	
}

//Export class
export = Network;