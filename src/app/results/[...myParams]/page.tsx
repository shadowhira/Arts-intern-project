// result/[...myParam]/page

import Gallery from "@/app/components/Homepage/Gallery";

type Props = {
  params: {
    myParams: (string | undefined)[];
  };
};

export function generateMetadata({ params: { myParams } }: Props) {
  const title = myParams?.[0] ?? "all";
  const page = myParams?.[1] ?? "1";

  return {
    title: `Results for "${title}" - Page ${page}`,
  };
}

export default function SearchResults({ params: { myParams } }: Props) {
  const title = myParams?.[0] ?? "all";
  const page = myParams?.[1] ?? "1";

  return <Gallery topic={title} page={page} />;
}