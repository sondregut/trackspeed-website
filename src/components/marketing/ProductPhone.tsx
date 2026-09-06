import Image from "next/image";

/** Display an unaltered native screenshot inside a quiet device frame. */
export default function ProductPhone({src, alt = "", className = ""}: {src: string; alt?: string; className?: string}) {
  return <div className={"product-phone " + className}>
    <Image src={src} alt={alt} width={1206} height={2622} sizes="(max-width: 640px) 220px, 340px"/>
  </div>;
}
