import Image from "next/image";

const ClientPage = () => {
  return (
    <div className="text-center flex items-center justify-center bg-yellow-100">
      <Image
        src="/images/dried-fruit.webp"
        alt="Picture of the author"
        width={500}
        height={500}
      />
    </div>
  );
};

export default ClientPage;
