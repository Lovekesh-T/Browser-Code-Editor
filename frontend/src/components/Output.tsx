
const Output = ({replId}:{replId:string | null}) => {
  
  console.log("times")

  return <iframe src={`http://${replId}.cloudid.com`} title="iframe" className="h-full w-full bg-white"></iframe>;
};

export default Output;
