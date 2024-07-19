// loaders/shopifyProducts.js
import { authenticate } from '../shopify.server';
import { json } from "@remix-run/node";
import { cors } from 'remix-utils/cors';

export async function loader({ request }) {
  try {
    const { admin } = await authenticate.public.appProxy(request);

    if (!admin) {
      console.error("Admin session not authenticated");
      return new Response("Admin session not authenticated", { status: 401 });
    }

    const response = await admin.graphql(
      `#graphql
      query getProducts {
        products(first: 3) {
          edges {
            node {
              id
              title
            }
          }
        }
      }`
    );

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors: ", result.errors);
      return new Response("Error fetching product data", { status: 500 });
    }

    console.log("Checking response of customer's wishlist  ", result.data.products.edges);

    const finalResult = json({
      ok: true,
      message: "Success",
      data: result.data.products.edges,
    });

    return cors(request, finalResult);

  } catch (error) {
    console.error("Error in admin session: ", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
