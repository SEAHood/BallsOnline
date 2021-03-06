
declare var io : {
	connect(): Socket;
	connect(url: string): Socket;
}
interface Socket {
	on(event: string, callback: (data: any) => void );
	emit(event: string, data: any);
}

declare module 'socket.io' {
    export = io;
}