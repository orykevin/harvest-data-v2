
interface fileMetaInterface{
    name: string;
    type: string;
    size: number;
    lastModifiedL: string;
}

const parseFile = (id:string) =>{
    const fileUploader : HTMLElement | null = document.getElementById(id) ;

    fileUploader.addEventListener('change', (event) => {
      const files = event.target.files;
      console.log('files', files);
      
      for (const file of files) {
        const name = file.name;
        const type = file.type ? file.type : 'NA';
        const size = file.size;
        const lastModified = file.lastModified;
        console.log({file, name, type, size, lastModified});
        }
    })
}
    
