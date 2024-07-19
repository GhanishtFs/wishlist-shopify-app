// import { json } from "@remix-run/node";
// import db from "../db.server";
// import { cors } from 'remix-utils/cors';

// // Get request: accept request with customerId and shop.
// // Read database and return wishlist items for that customer and shop.
// export async function loader({ request }) {
//     const url = new URL(request.url);
//     const customerId = url.searchParams.get("customerId");
//     const shop = url.searchParams.get("shop");
  
//     // Check if customerId and shop are provided
//     if (!customerId || !shop) {
//         return json({
//             message: "Missing data. Required data: customerId, shop",
//             method: "GET"
//         }, { status: 400 });
//     }
  
//     try {
//         // If customerId and shop are provided, return wishlist items for that customer and shop.
//         const wishlist = await db.wishlist.findMany({
//             where: {
//                 customerId: customerId,
//                 shop: shop,
//             },
//         });

//         wishlist.forEach(async item =>{
//             console.log(item.productId);
//         })
    
//         const response = json({
//             ok: true,
//             message: "Success",
//             data: wishlist,
//         });
    
//         return cors(request, response);
//     } catch (error) {
//         // Handle any errors that occur during database query
//         return json({
//             ok: false,
//             message: "Error retrieving wishlist items",
//             error: error.message,
//         }, { status: 500 });
//     }
// }

import { json } from "@remix-run/node";
import db from "../db.server";
import { cors } from 'remix-utils/cors';



// Get request: accept request with customerId and shop.
// Read database and return wishlist items for that customer and shop.
export async function loader({ request }) {
    // const { admin, session } = await authenticate.admin(request); 
    const url = new URL(request.url);
    const customerId = url.searchParams.get("customerId");
    const shop = url.searchParams.get("shop");
  
    // Check if customerId and shop are provided
    if (!customerId || !shop) {
        return json({
            message: "Missing data. Required data: customerId, shop",
            method: "GET"
        }, { status: 400 });
    }
  
    try {
        // If customerId and shop are provided, return wishlist items for that customer and shop.
        const wishlist = await db.wishlist.findMany({
            where: {
                customerId: customerId,
                shop: shop,
            },
        });

        // wishlist.forEach(async item =>{
            
        //     console.log(item.productId);
        //     console.log(session);
        //     // const productTitle = await fetchProductTitle(item.productId);
        // })
    
        const response = json({
            ok: true,
            message: "Success",
            data: wishlist,
        });
    
        return cors(request, response);
    } catch (error) {
        // Handle any errors that occur during database query
        return json({
            ok: false,
            message: "Error retrieving wishlist items",
            error: error.message,
        }, { status: 500 });
    }
}

