const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ARTICLES_TABLE;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
};

exports.createArticle = async (event) => {
  try {
    const { title, content } = JSON.parse(event.body);
    
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
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0,
      shares: 0
    };

    await dynamodb.put({
      TableName: tableName,
      Item: article
    }).promise();

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

exports.getRandomArticles = async (event) => {
  try {
    const result = await dynamodb.scan({
      TableName: tableName,
      Limit: 50
    }).promise();

    // Shuffle and return up to 10 random articles
    const shuffled = result.Items.sort(() => 0.5 - Math.random());
    const randomArticles = shuffled.slice(0, 10);

    // Increment view count for each article
    const updatePromises = randomArticles.map(article => 
      dynamodb.update({
        TableName: tableName,
        Key: { id: article.id },
        UpdateExpression: 'SET #views = #views + :inc',
        ExpressionAttributeNames: { '#views': 'views' },
        ExpressionAttributeValues: { ':inc': 1 },
        ReturnValues: 'ALL_NEW'
      }).promise()
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

exports.likeArticle = async (event) => {
  try {
    const { id } = event.pathParameters;

    const result = await dynamodb.update({
      TableName: tableName,
      Key: { id },
      UpdateExpression: 'SET likes = likes + :inc',
      ExpressionAttributeValues: { ':inc': 1 },
      ReturnValues: 'ALL_NEW'
    }).promise();

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

exports.shareArticle = async (event) => {
  try {
    const { id } = event.pathParameters;

    const result = await dynamodb.update({
      TableName: tableName,
      Key: { id },
      UpdateExpression: 'SET shares = shares + :inc',
      ExpressionAttributeValues: { ':inc': 1 },
      ReturnValues: 'ALL_NEW'
    }).promise();

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

exports.viewArticle = async (event) => {
  try {
    const { id } = event.pathParameters;

    const result = await dynamodb.update({
      TableName: tableName,
      Key: { id },
      UpdateExpression: 'SET #views = #views + :inc',
      ExpressionAttributeNames: { '#views': 'views' },
      ExpressionAttributeValues: { ':inc': 1 },
      ReturnValues: 'ALL_NEW'
    }).promise();

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