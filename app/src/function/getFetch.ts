import axios from "axios"
import { FileInterface } from "@/components/InputView/Inputview";

export interface progressInterface {
  started: boolean;
  percent: number;
}

export const getRequest = async (url : string, params = {}, token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(url, { params,paramsSerializer:{indexes:true}, headers });
      return await response.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  };

  export const postFile = async (url : string, datas : FileInterface[], progress: progressInterface, setProgress: React.Dispatch<React.SetStateAction<progressInterface>>  ) => {
    try {
      const formdata = new FormData();
      console.log(datas.length)
      for(let i = 0 ; i < datas.length ; i++){
        let newObj = {
          name_file : datas[i].file.name,
          size_file : datas[i].file.size,
          type: datas[i].file.type,
          date: datas[i].file.lastModified,
          client: datas[i].client
        }
        console.log(newObj)
        formdata.append("info", JSON.stringify(newObj))
        formdata.append("files", datas[i].file)
      }
      console.log(formdata)
      const result = await axios.post(url,formdata,{
        onUploadProgress : (progressEvent) => {
          console.log(progressEvent.progress)
          setProgress({...progress, percent: progressEvent.progress*100})
        }
      })
      return await result.data
    } catch (error) {
      console.error('Error in upload file', error);
      throw error;
    }
  };