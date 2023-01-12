const { SlashCommandBuilder } = require('discord.js');
const { getOrders } = require("../shopify/getOrders");
const { getStore, getAllStores } = require("../shopify/helper");
// Refer: https://discordjs.guide/creating-your-bot/slash-commands.html#individual-command-files

const getOrderSummary = async (storeKey, duration) => {
    const { start, end } = getDurationDates(duration);

    const store = getStore(storeKey);
    if (!store.accessToken) {
        return "Sorry, this command is not available for this store yet."
    }

    const orders = await getOrders(store, start, end);
    let total = 0;
    orders.forEach(order => {
        total += parseFloat(order.total_price);
    });

    return `
Report for ${store.name} | From ${start} to ${end}
No. of Orders: ${orders.length}
Total Sales: $${total.toFixed(2)}
`
}

function getDurationDates(duration) {
    var today = new Date();
    var startDate, endDate;
    
    if (duration === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (duration === "week") {
      var day = today.getDay();
      var diff = today.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(today.setDate(diff));
      endDate = new Date(today.setDate(diff + 6));
    } else if (duration === "year") {
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
    }else if (duration === "previous month") {
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
    }else if (duration === "previous week") {
      var day = today.getDay();
      var diff = today.getDate() - day - 7;
      startDate = new Date(today.setDate(diff));
      endDate = new Date(today.setDate(diff + 6));
    } else if (duration === "previous year") {
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
    } else {
      return "Invalid duration. Please use 'month', 'week', 'previous month', 'previous week' or 'previous year'.";
    }
    
    return { start: startDate.toISOString().split("T")[0], end: endDate.toISOString().split("T")[0] };
  }
  

const getStoreChoices = () => {
    const stores = getAllStores();
    let storeChoices = [];
    for (var storeKey in stores){
        storeChoices.push({ name: stores[storeKey].name, value: storeKey });
    }
    return storeChoices;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('store-sales')
		.setDescription('Get Shopify Store Sales')
        .addStringOption(option =>
            option.setName('store')
                .setDescription('Selected shopify store')
                .setRequired(true)
                .addChoices(...getStoreChoices()))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Sales period duration')
                .setRequired(true)
                .addChoices(
                    { name: 'Yearly', value: 'yearly' },
                    { name: 'Monthly', value: 'month' },
                    { name: 'Weekly', value: 'week' },
                    { name: 'Previous Year', value: 'previous year' },
                    { name: 'Previous Month', value: 'previous month' },
                    { name: 'Previous Weekly', value: 'previous weekly' },
        )),
	async execute(interaction) {
        // Defer interaction as getOrderSummary function may take time to execute
        await interaction.deferReply();
        const storeKey = interaction.options.getString('store');
        const duration = interaction.options.getString('duration');
        const summary = await getOrderSummary(storeKey, duration);
        await interaction.editReply(summary);
	},
};