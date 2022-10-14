import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import * as socketIO from 'socket.io';
import * as dotenv from 'dotenv';
import Message from './src/models/Message';
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const URL_MONGODB : string = process.env.URL_MONGODB as string;

mongoose.connect(URL_MONGODB,(error)=>{
    if (error) {
        console.log(error);
    } else {
        console.log("MongoDb connected");
    }
});

app.use('/', express.static(path.join(process.cwd(),'public')));

const server = app.listen(PORT, ()=>{
    console.log(`Running at port: ${PORT}`);
});

const io = new socketIO.Server(server);
io.on('connection', async(socket)=>{
    console.log("New connection !");
    socket.on("mensagemGrupo", async({nome, mensagem})=>{
        await new Message({
            nome: nome,
            mensagem: mensagem
        }).save();
        socket.emit("MensagensNoDb", JSON.stringify(await Message.find({})))

    })
});