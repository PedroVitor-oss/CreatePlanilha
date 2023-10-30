const { app } = require("./src/app");
const  port  = process.env.PORT ||require("./config.json").port;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

const { processarPDF } = require("./src/ControlerPDF");
app.get("/",(req,res)=>{

    const isMobile = req.headers['user-agent'].includes("Mobile");
    if(isMobile){
         res.redirect("/mobile");
    }
    res.render("home",
    {
        title:"create planilha DMR",
        isMobile,
       
    })
})

app.post("/planilha",upload.array('pdfFile'),async (req,res)=>{

    const isMobile = req.headers['user-agent'].includes("Mobile");
    if(isMobile) res.redirect("/mobile");

    const files = await req.files;
    let rows = [];
    for(file of files)
    {
        let dataFile = await processarPDF(file);
        rows = await rows.concat(dataFile);
            
    }
    //await console.log(rows);
    res.render("planilha",{
        title:"Planilha DMR'S",
        dataPlanilha:{
            lines:rows,
        }
    });


});

app.get("/mobile",(req,res)=>{
    res.render("mobi");
})

app.listen(port,console.log("aberto  em https://localhost:"+port));