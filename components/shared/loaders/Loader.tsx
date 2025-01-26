import Image from "next/image";
const Loader = () => (
  <div className="">
    <Image
      src="/assets/loader.svg"
      alt="loader"
      width={24}
      height={24}
      className="animate-spin"
    />
  </div>
);

export default Loader;
