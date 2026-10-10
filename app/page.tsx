
import { getProducts } from "@/lib/api";
import { Hero } from "@/components/Hero";
import { HomeSections } from "@/components/HomeSections";
import { GoogleAccountLinkButton } from "@/components/GoogleAccountLinkButton";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <div className="container-page py-4">
        
      </div>

      <Hero />
      <HomeSections products={products} />
    </>
  );
}