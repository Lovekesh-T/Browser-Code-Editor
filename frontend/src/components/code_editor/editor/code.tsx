
import Editor from "@monaco-editor/react";
import {File} from "../utils/file-manager";
import styled from "@emotion/styled";

export const Code = ({selectedFile,onChange}: { selectedFile: File | undefined ,onChange:(data:string | undefined)=>void}) => {
  if (!selectedFile)
    return null

  const code = selectedFile.content
  let language = selectedFile.name.split('.').pop()

  if (language === "js" || language === "jsx")
    language = "javascript";
  else if (language === "ts" || language === "tsx")
    language = "typescript"

  return (
    <Div >
      <Editor
        height="90vh"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={onChange}
      />
    </Div>
  )
}

const Div = styled.div`
  width: calc(100% - 250px);
  margin: 0;
  font-size: 16px;
`
