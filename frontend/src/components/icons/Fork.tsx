

const MyIcon = ({onClick}:{onClick:()=>void}) => (
  <span onClick={onClick}>
    <svg 
    preserveAspectRatio="xMidYMin" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    aria-hidden="true" 
    className="css-492dz9 fill-blue-500 hover:fill-blue-700 " 
    style={{ '--size': '16px', '--rotate': '0deg', width: '18px', height: '18px', }}
  >
    <path 
      fillRule="evenodd" 
      d="M21.25 6a2.25 2.25 0 1 0-4.5 0 2.25 2.25 0 0 0 4.5 0ZM19 2.25a3.75 3.75 0 1 1-3.675 4.5H12c-.69 0-1.25.56-1.25 1.25v8c0 .69.56 1.25 1.25 1.25h3.325a3.751 3.751 0 0 1 7.425.75 3.75 3.75 0 0 1-7.425.75H12A2.75 2.75 0 0 1 9.25 16v-3.25H2a.75.75 0 0 1 0-1.5h7.25V8A2.75 2.75 0 0 1 12 5.25h3.325c.348-1.712 1.86-3 3.675-3ZM21.25 18a2.25 2.25 0 1 0-4.5 0 2.25 2.25 0 0 0 4.5 0Z" 
      clipRule="evenodd"
    />
  </svg>
  </span>
);

export default MyIcon;
