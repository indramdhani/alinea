const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const tableName = process.env.ARTICLES_TABLE;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
};

// Main routing handler
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const { httpMethod, resource, pathParameters } = event;
    
    // Route to appropriate handler based on HTTP method and path
    if (httpMethod === 'POST' && resource === '/articles') {
      return await createArticle(event);
    } else if (httpMethod === 'GET' && resource === '/articles/random') {
      return await getRandomArticles(event);
    } else if (httpMethod === 'POST' && resource === '/articles/{id}/like') {
      return await likeArticle(event);
    } else if (httpMethod === 'POST' && resource === '/articles/{id}/share') {
      return await shareArticle(event);
    } else if (httpMethod === 'POST' && resource === '/articles/{id}/view') {
      return await viewArticle(event);
    } else if (httpMethod === 'POST' && resource === '/report-abuse') {
      return await reportAbuse(event);
    } else {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Route not found' })
      };
    }
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

const createArticle = async (event) => {
  try {
    const { title, content, tags = [] } = JSON.parse(event.body);
    
    if (!title || !content) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Title and content are required' })
      };
    }

    const article = {
      id: uuidv4(),
      title: title.substring(0, 200),
      content,
      tags: Array.isArray(tags) ? tags.slice(0, 10) : [],
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0,
      shares: 0
    };

    await dynamodb.send(new PutCommand({
      TableName: tableName,
      Item: article
    }));

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(article)
    };
  } catch (error) {
    console.error('Error creating article:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

const getRandomArticles = async (event) => {
  try {
    const result = await dynamodb.send(new ScanCommand({
      TableName: tableName,
      Limit: 50
    }));

    // Shuffle and return up to 10 random articles
    const shuffled = result.Items.sort(() => 0.5 - Math.random());
    const randomArticles = shuffled.slice(0, 10);

    // Increment view count for each article
    const updatePromises = randomArticles.map(article => 
      dynamodb.send(new UpdateCommand({
        TableName: tableName,
        Key: { id: article.id },
        UpdateExpression: 'SET #views = #views + :inc',
        ExpressionAttributeNames: { '#views': 'views' },
        ExpressionAttributeValues: { ':inc': 1 },
        ReturnValues: 'ALL_NEW'
      }))
    );

    const updatedArticles = await Promise.all(updatePromises);
    const articles = updatedArticles.map(result => result.Attributes);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(articles)
    };
  } catch (error) {
    console.error('Error getting random articles:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

const likeArticle = async (event) => {
  try {
    const { id } = event.pathParameters;

    const result = await dynamodb.send(new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: 'SET likes = likes + :inc',
      ExpressionAttributeValues: { ':inc': 1 },
      ReturnValues: 'ALL_NEW'
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error('Error liking article:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

const shareArticle = async (event) => {
  try {
    const { id } = event.pathParameters;

    const result = await dynamodb.send(new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: 'SET shares = shares + :inc',
      ExpressionAttributeValues: { ':inc': 1 },
      ReturnValues: 'ALL_NEW'
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error('Error sharing article:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

const viewArticle = async (event) => {
  try {
    const { id } = event.pathParameters;

    const result = await dynamodb.send(new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: 'SET #views = #views + :inc',
      ExpressionAttributeNames: { '#views': 'views' },
      ExpressionAttributeValues: { ':inc': 1 },
      ReturnValues: 'ALL_NEW'
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error('Error viewing article:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

const reportAbuse = async (event) => {
  try {
    const { title, link, description, timestamp, locale } = JSON.parse(event.body);
    
    if (!title || !link || !description) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Title, link, and description are required' })
      };
    }

    // Log the report data (in production, this would send an email via Resend)
    const reportData = {
      id: uuidv4(),
      title: title.substring(0, 200),
      link,
      description: description.substring(0, 1000),
      timestamp: timestamp || new Date().toISOString(),
      locale: locale || 'en',
      userAgent: event.headers?.['User-Agent'] || 'Unknown',
      sourceIP: event.requestContext?.identity?.sourceIp || 'Unknown'
    };

    console.log('Abuse Report Submitted:', JSON.stringify(reportData, null, 2));

    // TODO: Implement Resend email integration
    // const emailResult = await sendAbuseReportEmail(reportData);
    
    // For now, we'll just store it in DynamoDB as a placeholder
    // In production, you might want a separate table for reports
   // Uncomment and configure when ready
// const resend = new Resend(process.env.RESEND_API_KEY);
// await resend.emails.send({
//   from: 'reports@yourdomain.com',
//   to: 'admin@yourdomain.com', 
//   subject: `Abuse Report: ${reportData.title}`,
//   html: emailTemplate
// });

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: 'Report submitted successfully',
        reportId: reportData
      })
    };
  } catch (error) {
    console.error('Error submitting abuse report:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// Placeholder function for Resend email integration
// async function sendAbuseReportEmail(reportData) {
//   // TODO: Implement Resend API integration
//   // const resend = new Resend(process.env.RESEND_API_KEY);
//   // 
//   // const emailResult = await resend.emails.send({
//   //   from: 'reports@yourdomain.com',
//   //   to: 'admin@yourdomain.com',
//   //   subject: `Abuse Report: ${reportData.title}`,
//   //   html: `
//   //     <h2>New Abuse Report</h2>
//   //     <p><strong>Title:</strong> ${reportData.title}</p>
//   //     <p><strong>Link:</strong> <a href="${reportData.link}">${reportData.link}</a></p>
//   //     <p><strong>Description:</strong></p>
//   //     <p>${reportData.description}</p>
//   //     <p><strong>Submitted:</strong> ${reportData.timestamp}</p>
//   //     <p><strong>Locale:</strong> ${reportData.locale}</p>
//   //     <p><strong>Source IP:</strong> ${reportData.sourceIP}</p>
//   //   `
//   // });
//   // 
//   // return emailResult;
//   console.log('Email would be sent with Resend:', reportData);
//   return { success: true };
// }

// Export individual functions for testing purposes
module.exports = {
  handler: exports.handler,
  createArticle,
  getRandomArticles,
  likeArticle,
  shareArticle,
  viewArticle,
  reportAbuse
};