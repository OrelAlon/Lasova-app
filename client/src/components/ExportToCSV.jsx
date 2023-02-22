import { ExportToCsv } from 'export-to-csv';

const  ExportToCSV=(reportData,  fileTitle)=>
{
  
    let d=new Date()
    
    let dateFormat = `${d.getDay()}${d.getMonth()}${d.getFullYear()}`;
    let timeFormat = `${d.getHours()}${d.getMinutes()}`;

    console.log('timeFormat',timeFormat)
    let file_Name= 'Lasova'+ "_" + dateFormat +"_"+ timeFormat ;

          const options = { 
            filename: file_Name,
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: false,
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,

          };
          const csvExporter = new ExportToCsv(options);
    
          csvExporter.generateCsv(reportData);

}

export default ExportToCSV