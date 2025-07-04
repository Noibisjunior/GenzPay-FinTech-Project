const Invoice = require('../models/invoiceModel'); 
const generateShareableLink = require('../utils/shareableLink'); 

const createInvoice = async (req, res) => {
  try {
    const { customer, items, currency, issueDate, dueDate, status } = req.body;


    const invoice = await Invoice.create({
      userId: req.user.id,
      customer,
      items,
      currency,
      issueDate,
      dueDate,
      status
    });

await invoice.save();
    const shareableLink = generateShareableLink(invoice.id);


    return res.status(201).json({
      status: 201,
      message: 'Invoice created successfully',
      data: {
        shareable: shareableLink,
        customer,
        items,
        currency,
        issueDate,
        dueDate,
        status
      },
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error',
    });
  }
};




const getAllInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 0, size = 10, terms = '' } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);

    let query = { userId }; // Default query to get all invoices for the user

    // If a search term is provided, modify the query for search
    if (terms) {
      query = {
        ...query,
        $or: [
          { 'customer.name': { $regex: terms, $options: 'i' } },
          { 'customer.email': { $regex: terms, $options: 'i' } }
        ]
      };
    }

    const invoices = await Invoice.find(query)
      .skip(pageNumber * pageSize)
      .limit(pageSize);

      const formattedInvoices = invoices.map(invoice => ({
      id: invoice._id,
      shareable: `<https://link-to-view-invoice.com/${invoice._id}>`,
      customer:  invoice.customer,
      currency: invoice.currency,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      Status: invoice.status,
    }));

    return res.status(200).json({
      status: 200,
      message: terms
        ? 'Retrieved all paginated searched invoices successfully'
        : 'Retrieved all invoices successfully',
      data: formattedInvoices
    });
  } catch (error) {
    console.error('Error retrieving invoices:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};


const viewDraftInvoices = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes middleware has set req.user.id from the user token
    const { page = 0, size = 10, status = 'draft' } = req.query;

    // valid pagination parameters
    const limit = parseInt(size);
    const skip = parseInt(page) * limit;

    // Fetch draft invoices for the user with pagination
    const invoices = await Invoice.find({ userId, status: 'draft' })
      .skip(skip)
      .limit(limit);


    const formattedInvoices = invoices.map(invoice => ({
      id: invoice._id,
      shareable: `<https://link-to-view-invoice.com/${invoice._id}>`, // Updating actual link generation
      customer:  invoice.customer,
      currency: invoice.currency,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      Status: invoice.status,
    }));

    return res.status(200).json({
      status: 200,
      message: "Retrieved all paginated invoices successfully",
      data: formattedInvoices
    });
  } catch (error) {
    console.error('Error retrieving draft invoices:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};

const pendingInvoices = async (req, res) => {
    try {
      const userId = req.user.id; 
      const { page = 0, size = 10, status = 'pending' } = req.query;
  
    
      const limit = parseInt(size);
      const skip = parseInt(page) * limit;
  
      // Fetch draft invoices for the user with pagination
      const invoices = await Invoice.find({ userId, status: 'pending' })
        .skip(skip)
        .limit(limit);
  
  
      const formattedInvoices = invoices.map(invoice => ({
        id: invoice._id,
        shareable: `<https://link-to-view-invoice.com/${invoice._id}>`, // Updating actual link generation
        customer:  invoice.customer,
        currency: invoice.currency,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        Status: invoice.status,
      }));
  
      return res.status(200).json({
        status: 200,
        message: "Retrieved all pending invoices successfully",
        data: formattedInvoices
      });
    } catch (error) {
      console.error('Error retrieving pending invoices:', error);
      return res.status(500).json({
        status: 500,
        message: 'Server error'
      });
    }
  };
  

const getDueInvoices = async (req, res) => {
  try {
    const userId = req.user.id;    
      const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;
    const status = req.query.status || 'due';

    // Retrieve paginated due invoices for the user
    const invoices = await Invoice.find({ userId, status })
                                  .skip(page * size)
                                  .limit(size);

    // Check if any invoices were found
    if (invoices.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No due invoices found for user',
        data: []
      });
    }

  
    const formattedInvoices = invoices.map(invoice => ({
      id: invoice._id,
      shareable: `<https://link-to-view-invoice.com/${invoice._id}>`,
      customer:  invoice.customer,
      currency: invoice.currency,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      Status: invoice.status,
    }));

    return res.status(200).json({
      status: 200,
      message: 'Retrieved all paginated due invoices successfully',
      data: formattedInvoices
    });
  } catch (error) {
    console.error('Error fetching due invoices:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};



const overDueInvoices = async (req, res) => {
  try {
    const userId = req.user.id; // Extract the user ID from request (assuming authentication middleware sets this)
    
    // Parse pagination and status parameters
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;
    const status = req.query.status || 'overdue';

  
    const invoices = await Invoice.find({ userId, status })
                                  .skip(page * size)
                                  .limit(size);
console.log("Fetched invoices: ", invoices);
    // Check if any invoices was found
    if (invoices.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No overDue invoices found for user',
        data: []
      });
    }

  
    const formattedInvoices = invoices.map(invoice => ({
      id: invoice._id,
      shareable: `<https://link-to-view-invoice.com/${invoice._id}>`,
      Status: invoice.status,
      customer:  invoice.customer,
      currency: invoice.currency,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate
    }));
console.log(formattedInvoices)
    return res.status(200).json({
      status: 200,
      message: 'Retrieved all paginated overdue invoices successfully',
      data: formattedInvoices
    });
  } catch (error) {
    console.error('Error fetching overdue invoices:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};


const updateInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;

    // Find and update the invoice if it belongs to the authenticated user
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId, userId },
      updateData,
      { new: true } // return the updated document
    );

    if (!updatedInvoice) {
      return res.status(404).json({
        status: 404,
        message: 'Invoice not found',
        data: {}
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Invoice updated successfully',
      data: updatedInvoice
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error',
      data: {}
    });
  }
};


const getInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const userId = req.user.id;

    const invoice = await Invoice.findOne({ _id: invoiceId, userId });

    if (!invoice) {
      return res.status(404).json({
        status: 404,
        message: 'Invoice not found',
        data: {}
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Invoice retrieved successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error',
      data: {}
    });
  }
};


const deleteInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id; 
    const userId = req.user.id; 
console.log("Deleting Invoice ID:", invoiceId, "for user:", userId);
    // Find the invoice by ID and check if it belongs to the user
    const invoice = await Invoice.findOne({ _id: invoiceId, userId });
    if (!invoice) {
      return res.status(404).json({
        status: 404,
        message: 'Invoice not found',
        data: {}
      });
    }


    await Invoice.deleteOne({ _id: invoiceId });

    return res.status(200).json({
      status: 200,
      message: 'Invoice deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error',
      data: {}
    });
  }
};



module.exports = {createInvoice, getAllInvoices, 
                  viewDraftInvoices,pendingInvoices,
                  getDueInvoices,overDueInvoices,updateInvoice,getInvoiceById,deleteInvoice};