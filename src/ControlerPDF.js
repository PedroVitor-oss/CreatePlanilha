const fs = require("fs");
const pdf = require("pdf-parse");


const ControlerPDF = {
    GetDataString(datas,getData,lengthData){
        for(let i=0;i<datas.length;i++){
            if(datas[i] == getData[0]&& datas[i+getData.length-1] == getData[getData.length-1]){
                
                i = i+getData.length;
                let retutnSrting = '';
                for(let l =i;l<i+lengthData;l++){ 
                    if(datas[l]!=undefined)            
                        retutnSrting += datas[l];
                }
                return retutnSrting.trim();
            }
        }
    },
    CompararPalavra(text, start)
    {
        let palavras = ["Tonelada","Unidade"];
        let infoReturn = {
            igual : false,
            length: 0,
        }
        for(palavra of palavras)
        {
            let palavraSelecionada = text.substring(start,start+palavra.length);
            if(palavraSelecionada == palavra)
            {
                infoReturn.igual  = true;
                infoReturn.length = palavra.length;
                break;
                //console.log("palavra selecionda",palavraSelecionada,"palavra de comparação",palavra)
            }
        }
                    
        return infoReturn;
    },
    arrayInObject(array){
        return ({
            
            tratamento : array[0],
            codeIBGE   : array[1],
            residuo    : array[2],
            destino    : array[3],
            volume     : array[4],
            //volume2   : array[5],
            //volume3   : array[6],
            DMR        :   array[7],
            periodo    : array[8],
        })
    },
    async processarPDF(file) {
        try {
            const tempFilePath = file.path;
            const bufferFile = fs.readFileSync(tempFilePath);
            let datasReturn = [];
            let pages = [];
            const data = await pdf(bufferFile);
            //pegando texto das paginas do arquivo
            pages = data.text.split('\n\n');
            console.log("texto retirado");
            
            //retirar paginas em branco
            pages = pages.filter(page => page.trim() !== '');

            const DMR = ControlerPDF.GetDataString(pages[0],'DMR nº',7);
            const Periodo = ControlerPDF.GetDataString(pages[0],"Periodo:",24);
            console.log("\narquivo de "+pages.length+" pagina com a DRM "+DMR+" e o perido "+Periodo);
            for(page of pages)
            {
                console.log("pagina Nº "+pages.indexOf(page));
                const textTabela = ControlerPDF.GetDataString(page,"Destinador",page.length)
                //console.log("\ntexto da pagina\n\n"+textTabela);
                //caracteres para comparação
                const arrayNumber = [0,1,2,3,4,5,6,7,8,9];
                const arrayChar = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','º']
                
                //separar o bruto
                let datasTableString = [];
                let newdata = '';
                for(let i =0;i<textTabela.length;i++)
                {
                    
                    if(ControlerPDF.CompararPalavra(textTabela,i).igual){//inicio de 'Tonelada'
                        let contador = ControlerPDF.CompararPalavra(textTabela,i).length;
                        
                        for(l=contador;l<52;l++){
                            const charSelect = textTabela[i+l];
                            if(i+l == textTabela.length -1)
                            {
                                contador = l+1;
                                break;
                            }else{
                                for(char of arrayChar){
                                    if(char == charSelect){
                                        //console.log(charSelect)
                                        //console.log("char que representa uma letra do alfabeto");
                                        contador = l;
                                        //console.log("contador -",contador)
                                        l=100;
                                    }
                                }
                            }
                        }
                        newdata+=textTabela.slice(i,i+contador);
                        //console.log(newdata);
                        datasTableString.push(newdata);
                        newdata = '';
                        i+=contador-1;
                    }else{
                        newdata+=textTabela[i];
                    }
                }

                //separando o diluido
                let tableLines = []
                
                for(datastring of datasTableString){
                    let newdado = '';
                    let tableData = [];
                    for(let i =0;i<datastring.length;i++){
                        const char = datastring.charAt(i);
                        if(tableData.length<8){
                            switch(tableData.length){
                                case 0://tratamento
                                    if(!isNaN(char) && char.trim().length){
                                        
                                        tableData.push( newdado );
                                        newdado = '';
                                        i--;
                                    }else{
                                        newdado+=char;
                                    }
                                break;
                                case 1://cod. IBGE
                                    if(char=='-'){
                                        tableData.push( newdado );
                                        newdado = '';
                                    }else{
                                        if(char!="("&&char!=")"&&char!='*'){
                                            newdado+=char;
                                        }
                                    }
                                break;
                                case 2://residuo
                                    if(!isNaN(char) && char.trim().length && datastring[i+15]=='-'){  
                                        tableData.push( newdado );
                                        newdado = '';
                                        i+=16;//carateres cnpj
                                    }else{
                                        newdado+=char;
                                    }
                                break;
                                case 3://destino
                                    if(ControlerPDF.CompararPalavra(datastring,i).igual){
                                        tableData.push( newdado );
                                        newdado = '';
                                        i+=ControlerPDF.CompararPalavra(datastring,i).length - 1;
                                    }else{
                                        newdado+=char;
                                    }
                                break;
                                default:
                                    let newValue = '';
                                    for(let l = 0;l<datastring.length-i;l++){
                                        if(datastring[i+l] == ','){
                                            tableData.push(newValue+datastring.slice(i+l,i+l+5));
                                            i = i+l+4;
                                            break;
                                        }else{
                                            newValue+=datastring[i+l];
                                        }
                                    }
                                break;
                            }
                        }
                    }
                    tableData.push(DMR,Periodo);
                    tableLines.push(tableData);
                }
                
                datasReturn.push(tableLines);
            }

            let saveData = datasReturn;
            datasReturn = [];
            for(array of saveData)
            {
                for(item of array)
                {
                    datasReturn.push(ControlerPDF.arrayInObject(item));
                }
            }
            
            return datasReturn;
            
        } catch (error) {
          console.error(error);
        }
      }
}

module.exports = ControlerPDF;