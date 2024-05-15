const fs = require("fs")
const mailparser = require("mailparser") 


module.exports.simpleParser = async (files) =>{

    const allEmail = Promise.all(files.map(async(file)=>{
       const emldata = file.buffer.toString("utf8")
       const parsedEmail = await mailparser.simpleParser(emldata)
       return parsedEmail
    }))

    // for await (const file of files){
    //    const emldata = file.buffer.toString("utf8")
    //    mailparser.simpleParser(emldata, (err,mail)=>{
    //     if(err){
    //         console.log(err)
    //         return
    //     }
    //         //console.log(mail)
    //         allEmail.push(mail)
    //     })
    // }

    return allEmail
}