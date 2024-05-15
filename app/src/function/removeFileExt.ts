export const removeFileExt = (filename: string) => {
    const indexdot = filename.lastIndexOf(".");
    const nameFile = filename.substring(0,indexdot)
    return nameFile
}