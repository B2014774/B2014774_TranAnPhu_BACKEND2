const ContactService = require("../services/contact.service");
const MongoDB = require ("../utils/mongodb.utils");
const ApiError = require("../api-error");

//Create and Save a new Contact
exports.create = async (req,res,next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name cannot be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create (req.body);
        console.log(document);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error orcured while creating the contact")
        );
    }
};

//Retrive all contacts of a user from the database
exports.findAll = async (req,res,next) => {
    let documents = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const {name} =req.query;
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }
    } catch (error) {
        return next (
            new ApiError(500, "An error orcured while retriveing the contacts")
        );
    }

    return res.send(documents);
}

exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (err) {
        return next (
            new ApiError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        
        if(!document) {
            return next(new ApiError(404, "Contact not found")); //Hỏi thầy tại sao update được nhưng ko return document đx
        }
        return res.send({message: "Contact has been updated successfully"});
    } catch (err) {
        return next(new ApiError(
            500,
            `Error updating contact with id=${req.params.id}`
        ));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = contactService.delete(req.params.id);
        if (!document) {
            return next (new ApiError(404, "Contact not found"));
        }

        return res.send({message: "Contact was deleted successfully"});
    } catch (err) {
        return next(
            new ApiError (
                500,
                `Could not delete contact with id=${req.params.id}`
            )
        )
    }
};

exports.deleteAll = async (req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    } catch (err) {
        return next(new ApiError(
            500,
            `An error occurred while removing all contacts`
        ));
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try{   
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite(); 
        return res.send(documents);
    } catch (err) {
        return next(new ApiError(
            500,
            `An error occurred whild retrieving favorite contacts`
        ));
    }
};