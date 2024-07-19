import db from "../db.server";
import { cors } from 'remix-utils/cors';
import fetchProductDetails from "../productFetcher";

export async function loader({ request }) {
  
  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');
    const shopDomain = url.searchParams.get('shop');

    if (!customerId || !shopDomain) {
      return new Response('<div>Customer ID and Shop Domain are required</div>', {
        headers: {
          'Content-Type': 'text/html',
        },
        status: 400,
      });
    }

    const wishlist = await db.wishlist.findMany({
      where: {
        customerId: customerId,
        shop: shopDomain,
      },
    });

   const wishlistedItems =  await fetchProductDetails(wishlist,shopDomain);
  //  console.log("Item Price", wishlistedItems[0].id.substr(22,25))
  //  console.log(wishlistedItems,"Wishlist")
  if (wishlistedItems.length === 0)
    {
      let htmlResponse = '<h1>Wishlist Items</h1><br><br><h2>Add items to wishlist</h2>';
      
    const response = new Response(htmlResponse, {
      headers: {
        'Content-Type': 'text/html',
      },
    });


    return cors(request, response);
    }
  else
  {
    let htmlResponse = '<div><h1>Wishlist Items</h1><div class="wishlisted__products__container">';
    wishlistedItems.forEach(item =>{

      htmlResponse += `
        <div class="product__card">
        <a class="product__url" href="https://appteststore01.myshopify.com/products/${item.handle}">
        <div class="product__image__container">
        <img class="product__image" src="${item.featuredImage.url}"  alt="${item.title}"/>
        </div>
        <div class="product__title">Product title: ${item.title}</div> 
        <div class="product__price">
          <span ">${item.priceRangeV2.maxVariantPrice.currencyCode}<span>
          <span>${item.priceRangeV2.maxVariantPrice.amount}</span>
        </div>
        </a>
        <button  onclick="deleteItem(${item.id.substr(22,25)})" >Delete</button>
        </div>
        <br>`;
    });
    htmlResponse += '</div></div>';
  
    const response = new Response(htmlResponse, {
      headers: {
        'Content-Type': 'text/html',
      },
    });


    return cors(request, response);}

  } catch (error) {
    return new Response(`<div>Error retrieving wishlist items: ${error.message}</div>`, {
      headers: {
        'Content-Type': 'text/html',
      },
      status: 500,
    });
  }
}


