"use server";
import {scrapedProduct} from "./scraper/index";
export async function scrapAndStoreProduct(productUrl : string)
{
        if(!productUrl)
                return;
        
        
                try{
                        const scrapProduct = await scrapedProduct(productUrl);
                
                        if(!scrapedProduct)return;

                        //Store in the database
                
                }
                catch(error : any)
                {
                        throw new Error(`Failed to scrap and store product : ${error.message}`);
                }
}