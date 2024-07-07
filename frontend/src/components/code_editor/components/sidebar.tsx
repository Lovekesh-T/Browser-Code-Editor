import styled from "@emotion/styled";
import { ReactNode } from 'react';

export const Sidebar = ({children}: { children: ReactNode }) => {
  return (
    <Aside className="shadow-md rounded bg-[#0e0e0e]">
      {children}
    </Aside>
  )
}

const Aside = styled.aside`
  display: block;
  width: 250px;
  height: 90vh;
  border-right: 2px solid;
  border-color: #242424;
  padding-top: 3px;
`

export default Sidebar
