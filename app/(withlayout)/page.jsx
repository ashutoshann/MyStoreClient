import { getProducts, getProductTypes } from "@/app/actions/ProductActions";
import HomeScreens from "@/app/Screens/Home/index.jsx";

/**
 * @description: होम पेज - जिथे प्रॉडक्ट्सची यादी आणि कॅटेगरी फिल्टर लोड होतात.
 * @param {Object} searchParams: URL मधील फिल्टर पॅरामीटर्स (उदा. ?productTypeId=9)
 */
export default async function Home({ searchParams }) {
  // १. Next.js 15+ साठी searchParams ला 'await' करणे अनिवार्य आहे ✅
  const params = await searchParams; 

  // २. बॅकएंडकडून प्रॉडक्ट्स आणि कॅटेगरी डेटा मागवा
  const products = await getProducts(params);
  const categoriesData = await getProductTypes();

  // ३. डेटा ॲरे (Array) स्वरूपात आहे का याची खात्री करा
  const rawCategories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || []);

  // ४. डेटा मॅपिंग: युनिट लेव्हलवर 'label' आणि 'value' सेट करणे 🎯
  // यामुळे 'Kids' वर क्लिक केल्यावर बॅकएंडला ID (उदा. "9") जाईल, नाव नाही.
  const formattedCategories = [
    { label: "All Categories", value: "all" },
    ...rawCategories.map((cat) => ({
      label: cat.name,          // युजरला दिसणारे नाव (उदा. "Kids")
      value: String(cat.id),    // बॅकएंडला जाणारा ID (उदा. "9") ✅
    })),
  ];

  // ५. होम स्क्रीनला डेटा पाठवा
  return (
    <main>
      <HomeScreens 
        products={products} 
        productTypes={formattedCategories} 
      />
    </main>
  );
}