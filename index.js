const { app } = require("./src/app");
const  port  = process.env.PORT ||require("./config.json").port;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

const { processarPDF } = require("./src/ControlerPDF");
app.get("/",(req,res)=>{

    const isMobile = req.headers['user-agent'].includes("Mobile");

    res.render("home",
    {
        title:"create planilha DMR",
        isMobile,
        htmlStyles:[
        ],
        stylesMoblile:[
        ]
    })
})

app.post("/planilha",upload.array('pdfFile'),async (req,res)=>{
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

app.listen(port,console.log("aberto  em https://localhost:"+port));