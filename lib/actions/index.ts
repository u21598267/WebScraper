"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapedProduct } from "../../lib/actions/scraper/index";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../actions/utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  if(!productUrl) return;

  try {
    connectToDB();

    const scrapProduct = await scrapedProduct(productUrl);

    if(!scrapProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapProduct.url });

    if(existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapProduct.currentPrice }
      ]

      let product: any = {
              url: scrapProduct.url,
              currency: scrapProduct.currency,
              image: scrapProduct.image,
              title: scrapProduct.title,
              currentPrice: scrapProduct.currentPrice,
              originalPrice: scrapProduct.originalPrice,
              discountRate: scrapProduct.discountRate,
              category: scrapProduct.category,
              reviewsCount: scrapProduct.reviewsCount,
              rating: scrapProduct.stars,
              description: scrapProduct.description,
              priceHistory: [
                {
                  price: scrapProduct.currentPrice,
                },
              ],
              lowestPrice: scrapProduct.currentPrice,
              highestPrice: scrapProduct.currentPrice,
              averagePrice: scrapProduct.currentPrice,
            };

    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`)
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findOne({ _id: productId });

    if(!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();

    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId);

    if(!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    const product = await Product.findById(productId);

    if(!product) return;

    const userExists = product.users.some((user: User) => user.email === userEmail);

    if(!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}