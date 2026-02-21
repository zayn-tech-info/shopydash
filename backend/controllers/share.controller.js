const VendorPost = require("../models/vendorProduct");

exports.generateSharePreview = async (req, res) => {
  try {
    const { slug } = req.params;
    const mongoose = require("mongoose");
    let query;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      query = {
        $or: [{ "products.slug": slug }, { "products._id": slug }],
      };
    } else {
      query = { "products.slug": slug };
    }

    const post = await VendorPost.findOne(query).populate(
      "vendorId",
      "businessName username",
    );

    if (!post) {
      return res.status(404).send("Product not found");
    }

    const product = post.products.find(
      (p) => p.slug === slug || (p._id && p._id.toString() === slug),
    );
    const storeName = post.vendorId?.businessName || "ShopyDash Store";
    const username = post.vendorId?.username || "";
    const frontendUrl = process.env.FRONTEND_URL
      ? `${process.env.FRONTEND_URL}/p/${username}`
      : `https://app.shopydash.com/p/${username}`;

    const ogImage =
      product.image ||
      product.images[0] ||
      "https://shopydash.com/default-share-image.jpg";

    const title = product.title || "Product";
    const price = product.price ? `₦${product.price.toLocaleString()}` : "";
    const description = product.description || `Buy ${title} on ShopyDash`;

    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title} | ${storeName}</title>
          
          <meta property="og:title" content="${title} ${price ? `- ${price}` : ""}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${ogImage}" />
          <meta property="og:url" content="${frontendUrl}" />
          <meta property="og:type" content="product" />
          <meta property="og:site_name" content="ShopyDash" />

          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${title}">
          <meta name="twitter:description" content="${description}">
          <meta name="twitter:image" content="${ogImage}">

          <script>
            window.location.replace("${frontendUrl}");
          </script>
      </head>
      <body>
          <p>Redirecting to <a href="${frontendUrl}">${title}</a>...</p>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(htmlResponse);
  } catch (error) {
    console.error("Share Preview Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
