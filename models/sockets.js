const { usuarioConectado, usuarioDesconectado, getUsuarios, grabarMensaje } = require("../controllers/sockets");
const { comprobarJWT } = require("../helper/generar-jwt");


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async( socket ) => {


            const [ valido, uid ] = comprobarJWT(socket.handshake.query['x-token']);

            if (!valido) {
                console.log('socket no identificado');
                socket.disconnect();
            }

            await usuarioConectado( uid );

            // Unir al usuario a una sala de socket
            socket.join( uid );

            // TODO: SABER Q USUARIO ESTA ACTIVO MEDIANTE EL PAYLOAD.UID
            
            // EMITIR TODOS LOS USUARIOS CONECTADOS
            this.io.emit( 'lista-usuarios', await getUsuarios() );

            // TODO: Socket join, uid

            // escuchar cuando el cliente manda un mensaje
            // mensaje-personal
            socket.on('mensaje-personal', async(payload) => {
                const mensaje = await grabarMensaje( payload );

                this.io.to( payload.para ).emit('mensaje-personal', mensaje);
                this.io.to( payload.de ).emit('mensaje-personal', mensaje);
            });

            // TODO: emitir todos los usuarios conectados


            socket.on('disconnect', async() => {
                await usuarioDesconectado( uid );

                // Es como un refresh para ver que usuarios estan online y cuales no
                this.io.emit( 'lista-usuarios', await getUsuarios() );
            });
        });
    }


}


module.exports = Sockets;