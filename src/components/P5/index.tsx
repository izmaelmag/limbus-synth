import dynamic from "next/dynamic";

const P5Component = dynamic(() => import("./Component"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default P5Component;
