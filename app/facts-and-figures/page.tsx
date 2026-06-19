import { FactsContent } from "@/components/FactsContent";

export const revalidate = 300;

export default function FactsPage() {
  return <FactsContent locale="de" />;
}
