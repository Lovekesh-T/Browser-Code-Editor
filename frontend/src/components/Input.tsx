import { ChangeEvent } from "react";

interface InputProps{
    label:string;
    placeholder:string;
    onChange:(e:ChangeEvent<HTMLInputElement>)=>void;
    type:string;
    value:string

}

const Input = ({label,placeholder,onChange,type,value}:InputProps) => {
  return (
    <div>
      <label
        htmlFor={type}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
      value={value}
        onChange={onChange}
        type={type}
        name={type}
        id={type}
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
