import Image from "next/image";
import { ReactNode } from "react";

export function GuideInfoBox(props: { children: ReactNode }) {
  return (
    <div className="max-w-[768px] w-full overflow-hidden flex-col gap-5 flex text-md my-16 mx-auto">
      <div className="text-4xl text-center items-center justify-center flex">
        <Image src="/images/MetaMask-icon-Fox.svg" alt="Logo" width={97} height={48} />
      </div>

      <div className="text-sm max-w-[600px] mx-auto text-center">
        {props.children}
      </div>
    </div>
  );
}
