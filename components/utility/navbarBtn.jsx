import Link from "next/link";

export default function NavbarBtn({ btnName, btnLink }) {
  return (
    <Link href={btnLink}>
      <a className="font-semibold p-3 rounded-md mr-8 border-2 border-cyan-500 transition-all hover:translate-y-1 hover:bg-cyan-500">
        {btnName}
      </a>
    </Link>
  );
}
