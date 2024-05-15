import React, { useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FileInterface } from "./Inputview";
import { existsSync } from "fs";
import { baseStyle, focusedStyle, acceptStyle, rejectStyle } from "./dndStyle";
import { bufferImage } from "@/function/imageBuffer";
import ImageBar from "./ImageBar";
import { ScrollArea } from "../ui/scroll-area";
import { Mail } from "lucide-react";

interface PropsInterface {
  allFile: FileInterface[] | [];
  setAllFile: React.Dispatch<React.SetStateAction<FileInterface[] | []>>;
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  inputMode: string;
}

interface NewFileInterface extends File {
  path?: string;
  lastModifiedDate?: Date;
}

function DragnDrop(props: PropsInterface) {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      ...(props.inputMode === "eml" && { "message/rfc822": [".eml"] }),
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const filternSet = async () => {
    let fileArr = await Promise.all(
      acceptedFiles.filter((file: NewFileInterface) => {
        let isNew = props.allFile.some((exist) => {
          return file.name === exist.file.name && file.size === exist.file.size;
        });
        if (isNew) return false;
        if (!isNew) return true;
      })
    );
    let fileMapped = await Promise.all(
      fileArr.map(async (f: NewFileInterface): Promise<FileInterface> => {
        return {
          file: f,
          imageBuffer: props.inputMode == "img" ? await bufferImage(f) : null,
          client: null,
        };
      })
    );
    console.log(fileMapped);
    return fileMapped;
  };

  const deleteHandler = (index: number) => {
    let newFiles = props.allFile;
    newFiles.splice(index, 1);
    console.log(newFiles);
    props.setSelected(null);
    props.setAllFile([...newFiles]);
  };

  useEffect(() => {
    console.log(acceptedFiles);
    filternSet()
      .then((res) => props.setAllFile([...props.allFile, ...res]))
      .catch((err) => console.log(err));
  }, [acceptedFiles]);

  return (
    <div>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>
          {isDragAccept
            ? "Drop The files"
            : isDragReject && props.inputMode === "eml"
            ? "The files must be .eml"
            : "Click or Drag the files here"}
        </p>
      </div>
      <div>
        <h1>Files</h1>
        <ScrollArea className="all-file-container">
          {props.allFile.length > 0 &&
            props.allFile.map((file, i) => {
              //console.log(file);
              return (
                <ImageBar
                  file={file}
                  index={i}
                  selected={props.selected}
                  setSelected={props.setSelected}
                  key={i}
                  deleteHandler={deleteHandler}
                />
              );
            })}
        </ScrollArea>
      </div>
    </div>
  );
}

export default DragnDrop;
