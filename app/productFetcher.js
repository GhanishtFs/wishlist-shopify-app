import fetch from 'node-fetch';
import db from './db.server';


async function fetchProductDetails(wishlist, shop) {
  const wishlistItems = [];
console.log('---------------------------------------------------------------------------------------------------')
  try {
    // Fetch session token
    const sessionToken = await db.session.findFirst({
      where: {
        shop: shop,
      },
    });
    if (!sessionToken) {
      throw new Error('Session token not found for shop');
    }

    for (const item of wishlist) {
      const query = `
        query ($id: ID!) {
          product(id: $id) {
            handle
            id
            title
            priceRangeV2{
                maxVariantPrice{
                    amount
                    currencyCode
                }
                minVariantPrice{
                    amount
                    currencyCode
            }
            }
           featuredImage{
             url
            }
          }
        }
      `;

      const variables = { id: `gid://shopify/Product/${item.productId}` };
      const response = await fetch(`https://${shop}/admin/api/2023-07/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': sessionToken.accessToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      const responseBody = await response.json();
      wishlistItems.push(responseBody.data.product);
    }

    console.log(wishlistItems,"wishlistItems");
    return wishlistItems;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}

export default fetchProductDetails;


