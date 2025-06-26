const Card = require('../models/CardModel');

const createCard = async (req, res) => {
  const { name, type, brand} = req.body;

  try {
    const userId = req.user.id;

    // Mock third-party API call
    const cardData = {
      reference: 'mock_ref_' + Date.now(),
      card_reference: 'mock_card_ref_' + Date.now(),
      type: type ,
      currency: 'USD',
      holderName: name,
      brand,
      expiry_month: '12',
      expiry_year: '2028',
      first_six: '123456',
      last_four: '7890',
      status: 'active',
    };

    const newCard = await Card.create({
      userId,
      ...cardData,
    });

    return res.status(201).json({
      status: 201,
      message: 'Card created successfully',
      data: cardData,
    });
  } catch (error) {
    console.error('Error creating card:', error);
    return res.status(500).json({
      status: 500,
      message: 'Failed to create card',
      error: error.message || 'An unexpected error occurred',
    });
  }
};



const getAllCards = async (req, res) => {
  try {
    const userId = req.user.id; 
    const page = parseInt(req.query.page) || 0; 
    const size = parseInt(req.query.size) || 10; 

    // Fetch cards with pagination
    const cards = await Card.find({ userId })
      .skip(page * size)
      .limit(size);

    // Check if any cards were retrieved
    if (cards.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No cards found for user',
        data: []
      });
    }

    
    const formattedCards = cards.map(card => ({
       _id: card._id,
      reference: card.reference,
      card_reference: card.card_reference,
      type: card.type,
      currency: card.currency,
      holderName: card.holderName,
      brand: card.brand,
      expiry_month: card.expiry_month,
      expiry_year: card.expiry_year,
      first_six: card.first_six,
      last_four: card.last_four,
      status: card.status,
      date: card.createdAt 
    }));
console.log(formattedCards)
    return res.status(201).json({
      status: 201,
      message: 'Retrieved all paginated cards successfully',
      data: formattedCards
    });
  } catch (error) {
    console.error('Error retrieving cards:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};

 

const getCardById = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.id;

    // Fetch the card by ID and ensure it belongs to the authenticated user
    const card = await Card.findOne({ _id: id, userId });

    if (!card) {
      return res.status(404).json({
        status: 404,
        message: 'Card not found'
      });
    }


    return res.status(201).json({
      status: 201,
      message: 'Retrieved a single card successfully',
      data: {
        reference: card.reference,
        card_reference: card.card_reference,
        type: card.type,
        currency: card.currency,
        holderName: card.holderName,
        brand: card.brand,
        expiry_month: card.expiry_month,
        expiry_year: card.expiry_year,
        first_six: card.first_six,
        last_four: card.last_four,
        status: card.status,
        date: card.date,
        
      }
    });
  } catch (error) {
    console.error('Error retrieving card:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};


const deleteCard = async (req, res) => {
    try {
      const cardId = req.params.id; 
      const userId = req.user.id; 
  
      // Find the card by ID and check if it belongs to the user
      const userCard = await Card.findOne({ _id: cardId, userId });
      if (!userCard) {
        return res.status(404).json({
          status: 404,
          message: 'card not found',
          data: {}
        });
      }
  
      
      await Card.deleteOne({ _id: cardId });
  
      return res.status(200).json({
        status: 200,
        message: 'card deleted successfully',
        data: {}
      });
    } catch (error) {
      console.error('Error deleting card:', error);
      return res.status(500).json({
        status: 500,
        message: 'Server error',
        data: {}
      });
    }
  };
  
  
  


module.exports = { createCard,getAllCards, getCardById, deleteCard 
};

//For API SandBox
/*const axios = require('axios');

const createCard = async (req, res) => {
  const { name, type, brand } = req.body;

  try {
    const userId = req.user.id;

    // External API Request
    const response = await axios.post(
      `${process.env.MARQETA_API_URL}/cards`,
      {
        user_token: userId,
        card_product_token: "prod_12345",
        exp_month: "12",
        exp_year: "2028",
        cardholder_name: name
      },
      {
        auth: {
          username: process.env.MARQETA_API_KEY,
          password: process.env.MARQETA_API_SECRET
        }
      }
    );

    const cardData = response.data;

    // Save locally
    await Card.create({
      userId,
      reference: cardData.token,
      type,
      brand,
      currency: 'USD',
      holder_name: cardData.cardholder_name,
      expiry_month: cardData.exp_month,
      expiry_year: cardData.exp_year,
      status: 'active',
    });

    return res.status(201).json({
      status: 201,
      message: 'Card created successfully via Marqeta API',
      data: cardData
    });
  } catch (error) {
    console.error('Error creating card via API:', error);
    return res.status(500).json({
      status: 500,
      message: 'Failed to create card via API',
      error: error.response?.data || error.message
    });
  }
};*/
