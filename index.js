const { app } = require("./src/app");
const { createHome,styleHome } = require("./components/home");
const { port } = require("./config.json");

app.get("/",(req,res)=>{
    res.render("home",
    {
        title:"app node hbs",
        Home:createHome("Seja Bem Vindo","abra o index.js para começar aprogramar seu projeto"),
        htmlStyles:[
            {css:styleHome},
        ]
    })
})

app.listen(port,console.log("aberto  em https://localhost:"+port));