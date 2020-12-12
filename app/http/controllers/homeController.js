const Menu=require('../../models/menu');
function homeController(){
    return {
        async index(req,res){
            // Menu.find().then((pizzas)=>{
            //     console.log(pizzas);
            //     res.render('home', { pizzas: pizzas});
            // }).catch((error)=>{
            //     console.log(error)
            // })
            const pizzas=await Menu.find();
            res.render('home', { pizzas: pizzas });
        }
    }
}

module.exports=homeController;