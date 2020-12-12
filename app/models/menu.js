const mongoose=require('mongoose');
const menuSchema=new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
})


const Menu=new mongoose.model('menu',menuSchema);
module.exports=Menu;