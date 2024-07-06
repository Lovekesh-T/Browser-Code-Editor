import React from 'react'
import {buildFileTree, Directory, RemoteFile} from "./file-manager";

export const useFilesFromSandbox = (fileStructure:RemoteFile[],callback: (dir: Directory) => void) => {
  React.useEffect(() => {
    const rootDir = buildFileTree(fileStructure);
    callback(rootDir)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileStructure])
}
