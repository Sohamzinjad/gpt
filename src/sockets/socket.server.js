import { Server } from "socket.io";

function initSockerServer (httpServer){
    const io = new Server(httpServer , {});

    io.on("connection" , (socket)=>{
        console.log("New User Connected" , socket.id)
    })



}
module.exports = initSockerServer   