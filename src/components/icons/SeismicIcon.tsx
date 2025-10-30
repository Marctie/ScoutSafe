import type { SVGProps } from "react";

export function SeismicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 8.5h2.5l2 10 2-10 2 10 2-10 2 10 2.5-10H22" />
      <path d="M8 19h8" />
    </svg>
  );
}
