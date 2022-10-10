import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    mensagem: { type: String, required: true }
});

export default mongoose.model("Mensagem", messageSchema);