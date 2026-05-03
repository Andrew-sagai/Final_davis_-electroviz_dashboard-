const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free models on OpenRouter
const AI_MODEL = 'mistralai/mistral-7b-instruct:free';

export async function sendAIMessage(
  userMessage: string,
  dataSummary: string,
  apiKey: string,
): Promise<string> {
  if (!apiKey) {
    return generateOfflineResponse(userMessage, dataSummary);
  }

  const systemPrompt = `You are an expert data analyst AI assistant embedded in an electronics sales analytics dashboard. 
You analyze data from an "Electronics Sales Dataset (Sep 2023 - Sep 2024)" containing ~20,000 transactions.

RULES:
1. ONLY answer based on the provided data context below
2. Give specific numbers, percentages, and insights
3. Be concise but thorough
4. Use bullet points for clarity
5. If asked about something not in the data, say so
6. Provide actionable business insights when relevant
7. Reference specific products, time periods, and metrics

CURRENT DATA CONTEXT:
${dataSummary}`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ElectroViz Analytics Dashboard',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error?.message || `API Error: ${response.status}`);
    }

    const result = await response.json();
    return result.choices?.[0]?.message?.content || 'No response generated.';
  } catch (error: any) {
    console.error('AI API Error:', error);
    // Fallback to offline analysis
    return generateOfflineResponse(userMessage, dataSummary);
  }
}

function generateOfflineResponse(question: string, dataSummary: string): string {
  const q = question.toLowerCase();

  // Parse summary for metrics
  const revenueMatch = dataSummary.match(/Total Revenue: \$([0-9,]+)/);
  const ordersMatch = dataSummary.match(/Total Orders: ([0-9,]+)/);
  const ratingMatch = dataSummary.match(/Average Rating: ([0-9.]+)/);
  const customersMatch = dataSummary.match(/Unique Customers: ([0-9,]+)/);
  const loyaltyMatch = dataSummary.match(/Loyalty Members: ([0-9.]+)%/);

  const revenue = revenueMatch?.[1] || 'N/A';
  const orders = ordersMatch?.[1] || 'N/A';
  const rating = ratingMatch?.[1] || 'N/A';
  const customers = customersMatch?.[1] || 'N/A';
  const loyalty = loyaltyMatch?.[1] || 'N/A';

  if (q.includes('revenue') || q.includes('sales') || q.includes('total')) {
    return `📊 **Revenue Analysis**\n\nBased on the current filtered data:\n\n• **Total Revenue**: $${revenue}\n• **Total Orders**: ${orders}\n• **Average Order Value**: Calculated from revenue/orders\n• **Unique Customers**: ${customers}\n\nThe data shows the overall sales performance across the selected period and filters. To see trends over time, check the line chart on the dashboard.`;
  }

  if (q.includes('product') || q.includes('compare') || q.includes('best') || q.includes('top')) {
    return `🏆 **Product Performance Insights**\n\nBased on the current data:\n\n• The product breakdown is shown in the "Sales by Product" section\n• Check the bar chart for comparative revenue by product type\n• Products include: Smartphone, Laptop, Tablet, Smartwatch, and Headphones\n• Revenue rankings and order counts are available in the Sales & Products page\n\n💡 **Tip**: Use the product type filter to focus on specific categories.`;
  }

  if (q.includes('customer') || q.includes('age') || q.includes('demographic')) {
    return `👥 **Customer Demographics**\n\n• **Total Unique Customers**: ${customers}\n• **Loyalty Members**: ${loyalty}% of transactions\n• Age distribution spans from 18 to 65+\n• Visit the Customer Analytics page for detailed:\n  - Age distribution histogram\n  - Gender comparison charts\n  - Spending by customer segment\n  - Age vs spending heatmap`;
  }

  if (q.includes('trend') || q.includes('time') || q.includes('month')) {
    return `📈 **Trend Analysis**\n\n• Data spans from September 2023 to September 2024\n• Monthly revenue and order trends are visible in the line/area charts\n• Look for seasonal patterns in the dashboard overview\n• Loyalty membership trends are tracked over time\n\n💡 Use the date range filter to zoom into specific periods.`;
  }

  if (q.includes('rating') || q.includes('review') || q.includes('satisfaction')) {
    return `⭐ **Rating Insights**\n\n• **Average Rating**: ${rating}/5\n• Ratings range from 1 to 5 across all products\n• Product-level ratings are available in the Sales & Products page\n• Rating correlates with product type and customer satisfaction\n\n💡 Compare ratings across products using the product performance charts.`;
  }

  if (q.includes('payment') || q.includes('pay')) {
    return `💳 **Payment Method Analysis**\n\nPayment methods used include:\n• Credit Card\n• PayPal\n• Cash\n• Bank Transfer\n• Debit Card\n\nThe pie chart on the dashboard shows the distribution. Each method's popularity varies across different customer segments.`;
  }

  if (q.includes('loyalty') || q.includes('member')) {
    return `🎖️ **Loyalty Program Insights**\n\n• **Loyalty Rate**: ${loyalty}% of transactions are from loyalty members\n• Loyalty vs non-loyalty spending patterns differ significantly\n• Track loyalty trends over time in the Customer Analytics page\n• Loyalty members typically show different purchasing behavior\n\n💡 Filter by "Loyalty Member" to compare segments.`;
  }

  if (q.includes('insight') || q.includes('summary') || q.includes('overview')) {
    return `📋 **Dashboard Summary & Key Insights**\n\n**Key Metrics:**\n• Revenue: $${revenue}\n• Orders: ${orders}\n• Avg Rating: ${rating}/5\n• Customers: ${customers}\n• Loyalty Rate: ${loyalty}%\n\n**Key Observations:**\n1. The dataset covers 12 months of electronics sales\n2. Multiple product categories are tracked\n3. Customer demographics span various age groups\n4. Multiple payment and shipping methods are used\n\n💡 Use filters to drill down into specific segments for deeper insights.`;
  }

  return `🤖 **AI Analytics Assistant**\n\nI can help you analyze:\n\n• 📊 **Revenue & Sales** — "What's the total revenue?"\n• 🏆 **Products** — "Compare product performance"\n• 👥 **Customers** — "Show customer demographics"\n• 📈 **Trends** — "Explain the sales trend"\n• ⭐ **Ratings** — "What's the average rating?"\n• 💳 **Payments** — "Payment method distribution"\n• 🎖️ **Loyalty** — "Loyalty member insights"\n\n**Current Data**: ${orders} orders, $${revenue} revenue\n\nAsk me anything about the data!`;
}
