import { TopTenContent } from "@/components/TopTenContent";

export const revalidate = 300;

export default function TopTenPage() {
  return <TopTenContent locale="de" />;
}
