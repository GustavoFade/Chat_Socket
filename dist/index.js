"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const socketIO = __importStar(require("socket.io"));
const dotenv = __importStar(require("dotenv"));
const Message_1 = __importDefault(require("./src/models/Message"));
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const URL_MONGODB = process.env.URL_MONGODB;
mongoose_1.default.connect(URL_MONGODB, (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("MongoDb connected");
    }
});
app.use('/', express_1.default.static(path_1.default.join(process.cwd(), 'public')));
const server = app.listen(PORT, () => {
    console.log(`Running at port: ${PORT}`);
});
const io = new socketIO.Server(server);
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("New connection !");
    socket.on("mensagemGrupo", ({ nome, mensagem }) => __awaiter(void 0, void 0, void 0, function* () {
        yield new Message_1.default({
            nome: nome,
            mensagem: mensagem
        }).save();
        socket.emit("MensagensNoDb", JSON.stringify(yield Message_1.default.find({})));
    }));
}));
