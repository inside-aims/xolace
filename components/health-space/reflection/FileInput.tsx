import Image from "next/image";
import {FileInputProps} from "@/components/health-space/reflection/index";
import { CloudUpload } from 'lucide-react';

const FileInput = ({id, label, accept, file, previewUrl, inputRef, onChange, onReset, type,}: FileInputProps) => (
  <section className="w-full flex flex-col">
    <label htmlFor={id} className={""}>{label}</label>
    <input
      type="file"
      id={id}
      accept={accept}
      hidden
      ref={inputRef}
      onChange={onChange}
    />

    {!previewUrl ? (
      <figure onClick={() => inputRef.current?.click()} className={"border flex justify-center items-center w-full h-24 gap-2 cursor-pointer"}>
        <CloudUpload className={"w-6 h-6"}/>
        <p>Click to upload your {id}</p>
      </figure>
    ) : (
      <div className={"relative w-full h-32 rounded-lg overflow-hidden"}>
        {type === "video" ? (
          <video src={previewUrl} controls  className={"w-full h-full object-contain"}/>
        ) : (
          <Image src={previewUrl} alt={`Selected ${id}`} fill  className={"object-contain"}/>
        )}
        <button type="button" onClick={onReset} className={"flex border rounded-2xl"}>
          <Image
            src="/assets/close.svg"
            alt="Close Icon"
            width={16}
            height={16}
          />
        </button>
        <p>{file?.name}</p>
      </div>
    )}
  </section>
);

export default FileInput;
