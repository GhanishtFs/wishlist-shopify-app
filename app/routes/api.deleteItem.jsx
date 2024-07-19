import db from "../db.server";
import { cors } from 'remix-utils/cors';
import { json } from "@remix-run/node";

export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');
    const shopDomain = url.searchParams.get('shop');
    const productId = url.searchParams.get("productId");

    if (!customerId || !shopDomain || !productId) {
      return new Response('<div>Customer ID, productId, and Shop Domain are required</div>', {
        headers: {
          'Content-Type': 'text/html',
        },
        status: 400,
      });
    }

    // Find the item first
    const wishlistItem = await db.wishlist.findFirst({
      where: {
        customerId: customerId,
        shop: shopDomain,
        productId: productId,
      },
    });

    if (!wishlistItem) {
      return new Response('<div>Item not found</div>', {
        headers: {
          'Content-Type': 'text/html',
        },
        status: 404,
      });
    }

    // Delete the item using its unique ID
    const deleteItem = await db.wishlist.delete({
      where: {
        id: wishlistItem.id,
      },
    });

    const response = json({
      ok: true,
      message: "Success",
      data: deleteItem,
    });

    return cors(request, response);
  } catch (error) {
    console.log(error.message);
    return new Response(`<div>Error: ${error.message}</div>`, {
      headers: {
        'Content-Type': 'text/html',
      },
      status: 500,
    });
  }
}
