
# Discord x Shopify Bot

This Node JS based discord bot that interacts with the Shopify API to get Shopify store data. For example we may request weekly sales data from the bot.



## Environment Variables

To run this project, you will need to add the following environment variables to each of the .env files. 

Inside the file **config/config.json** add: 

`BOT_TOKEN` - Discord Bot token

`CLIENT_ID` - Discord Client ID

`GUILD_ID` - Discord Guild ID

Inside the file **config/stores.json** add: 

{
    `"STORE KEY"`: {
        "name": `STORE NAME`, 
        "accessToken": `SHOPIFY PRIVATE APP KEY`, 
        "shop": `STORE URL`
    }
}

`STORE KEY` - Unique key for each Shopify store 

`STORE NAME` - Shopify store name

`SHOPIFY PRIVATE APP KEY` - Shopify store private key 

`STORE URL` - From your store url, use the area in bold for this field https://**STORE_URL**.myshopify.com/ 



