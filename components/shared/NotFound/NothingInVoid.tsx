import React from 'react';
import Image from 'next/image';
const NothingInVoid = () => {
  return (
    <div>
      <Image
        src="/assets/void.svg"
        alt="Nothing In Void"
        width={150}
        height={150}
        className=""
      />
    </div>
  );
};

export default NothingInVoid;
