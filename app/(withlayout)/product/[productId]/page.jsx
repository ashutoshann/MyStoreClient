// जुनं काढून हे टाक:
import Product from "../../../Screens/Product/index";
import { getProductById } from "../../../actions/ProductActions";

export default async function ProductPage({ params }) {
  // १. फोल्डरचं नाव [productId] असेल तर इथे हुबेहूब 'productId' च लिहा ✅
  const resolvedParams = await params;
  const productId = resolvedParams.productId; 

  // २. बॅकएंड टर्मिनलमध्ये चेक करण्यासाठी:
  console.log("--- Requesting Data for ID:", productId, "---");

  // ३. डेटा मागवा
  const productData = await getProductById(productId);

  // ४. जर डेटा मिळाला नाही तर एरर मेसेज
  if (!productData) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-red-500">क्षमस्व! प्रॉडक्ट सापडले नाही.</h2>
        <p className="text-gray-500">ID: {productId} साठी डेटाबेसमध्ये काहीही सापडले नाही.</p>
        <p className="mt-4 text-sm">टीप: बॅकएंड सर्व्हर ३००१ पोर्टवर चालू आहे ना ते तपासा.</p>
      </div>
    );
  }

  // ५. डेटा 'product' या नावानेच पाठवा 🎯
  return <Product product={productData} />;
}