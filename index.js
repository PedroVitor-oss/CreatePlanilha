const { app } = require("./src/app");
const { createHome,createStyleHome } = require("./components/home");
const { port } = require("./config.json");

app.get("/",(req,res)=>{

    const isMobile = req.headers['user-agent'].includes("Mobile");
    

    res.render("home",
    {
        title:"app node hbs",
        isMobile,
        Home:createHome("Seja Bem Vindo","abra o index.js para começar aprogramar seu projeto"),
        htmlStyles:[
            {css:createStyleHome(isMobile)},
        ],
        stylesMoblile:[
            {css:"/css/mobile.css"}
        ]
    })
})

app.listen(port,console.log("aberto  em https://localhost:"+port));