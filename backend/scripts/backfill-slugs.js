const mongoose = require("mongoose");
const VendorPost = require("../models/vendorProduct");
const dotenv = require("dotenv");
const slugify = require("slugify");
const crypto = require("crypto");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI not found in env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Backfilling.");

    const posts = await VendorPost.find({});
    let updatedCount = 0;

    for (const post of posts) {
      let needsSave = false;
      if (post.products && post.products.length > 0) {
        for (const product of post.products) {
          if (!product.slug && product.title) {
            const baseSlug = slugify(product.title, {
              lower: true,
              strict: true,
            });
            const shortId = crypto.randomBytes(3).toString("hex");
            product.slug = `${baseSlug}-${shortId}`;
            needsSave = true;
          }
        }
      }
      if (needsSave) {
        // Prevent validating things that might fail from older schemas
        await post.save({ validateBeforeSave: false });
        updatedCount++;
        console.log(`Updated post: ${post._id}`);
      }
    }

    console.log(`Completed. Backfilled slugs for ${updatedCount} posts.`);
    process.exit(0);
  } catch (err) {
    console.error("Error backfilling slugs:", err);
    process.exit(1);
  }
};

run();
