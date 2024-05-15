import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface propsInterface {
  filename: string;
}

function EmailDialog({ filename }: propsInterface) {
  console.log(filename)
  const [isIFrameLoaded, setIFrameLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    setIFrameLoaded(true);

    let iframeDocument = iframeRef.current?.contentDocument;

    const head = iframeDocument?.querySelector("head");
    let cssLink = document.createElement("link");
    cssLink.href = "../../src/components/TableView/Iframe.css";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";

    head?.appendChild(cssLink);
  };

  function checkParentDiv(imgElement) {
    const parent = imgElement.parentNode;
    if (parent && parent.tagName.toLowerCase() === "div") {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    //console.log(iframeRef.current);
    if (iframeRef.current !== null && iframeRef.current !== undefined) {
      let allTag = [
        ...iframeRef.current?.contentDocument?.getElementsByTagName("img"),
      ].filter((image) => {
        return checkParentDiv(image);
      });
      allTag.forEach((element) => {
        element.style.width = "100%";
        element.style.marginTop = "25px";
      });
      let allTable = [
        ...iframeRef.current?.contentDocument?.getElementsByTagName("table"),
      ];
      allTable.forEach((element) => {
        element.style.width = "100%";
        element.style.maxWidth = "100%";
      });
      let allBlockQuote = [
        ...iframeRef.current?.contentDocument?.getElementsByTagName(
          "blockquote"
        ),
      ];
      for (let i = 0; i < allBlockQuote.length; i++) {
        let allBlockQuotes = [
          ...iframeRef.current?.contentDocument?.getElementsByTagName(
            "blockquote"
          ),
        ];
        if (allBlockQuotes.length > 0) {
          allBlockQuotes.forEach((element) => {
            let divCont = document.createElement("div");
            divCont.innerHTML = element.innerHTML;
            element.parentNode.replaceChild(divCont, element);
          });
        }
      }
    }
  }, [iframeRef.current]);

  return (
    <Dialog
      onOpenChange={() => {
        setIFrameLoaded(false);
      }}
    >
      <DialogTrigger style={{ textDecoration: "underline" }}>
        <h1>{filename}</h1>
      </DialogTrigger>
      <DialogContent style={{ minWidth: "55vw" }}>
        <DialogHeader>
          <DialogTitle>{isIFrameLoaded ? filename : "Loading ..."}</DialogTitle>
        </DialogHeader>
        <iframe
          ref={iframeRef}
          title="Email HTML"
          src={`/emails/${filename}.html`}
          width={"100%"}
          onLoad={handleLoad}
          id="iframehtml"
          className="h-[70vh] z-10 "
        />
      </DialogContent>
    </Dialog>
  );
}

export default EmailDialog;
