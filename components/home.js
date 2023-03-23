const Home = {
    createHome(title,text){
        return(
            `
            <div>
            <h1>${title}</h1>
            <p>${text}</p>
            </div>
            `
        )
    },
   
    styleHomeMobile:`
    body{
         
        background-color:#ff072b;
        display:flex;
        justify-content:center;
        aling-items:center;
        padding-top:7%;
        
    }
    div{
        width:auto;
        height:50vh;
        display:flex;
        flex-direction: column;
        scale: 2;
        justify-content:center;
        text-align:center;
        
    }
    `,
    styleHomePC:`
        body{
         
            background-color:#f0772b;
            display:flex;
            justify-content:center;
            aling-items:center;
            padding-top:7%;
            
        }
        div{
            width:auto;
            height:50vh;
            display:flex;
            flex-direction: column;
            scale: 2;
            justify-content:center;
            text-align:center;
            
        }
    `,
    createStyleHome(isMobile){
        if(isMobile){
            console.log("Mobile");
            return(Home.styleHomeMobile);
        }else{
            console.log("PC");
            return(Home.styleHomePC);
        }
    }
}

module.exports = Home;
