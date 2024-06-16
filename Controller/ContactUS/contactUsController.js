const ContactUsModel = require('../../Model/ContactUs/contactUsModel');

const Insert = async (req, res) => {
    try {
        const { firstName, lastName, emailId, MobileNo, Message, } = req.body;

        const newContact = new ContactUsModel({
            firstName,
            lastName,
            emailId,
            MobileNo,
            Message,
        });
        await newContact.save();
        res.status(201).json("Thank You for Contacting Us");

    } catch (error) {
        res.status(500).json({ error: "failed to send contact data" });
    }
};


const GetAll = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const search = req.body.search || '';

        const query = {
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { emailId: { $regex: search, $options: 'i' } },
                { Message: { $regex: search, $options: 'i' } }
            ]
        }
        const totalDocuments = await ContactUsModel.countDocuments(query);

        const totalPages = Math.ceil(totalDocuments / limit);

        //ensure that the currentpage will be always between 1 and total pages;
        const currentPage = Math.min(Math.max(page, 1), totalPages);
        const skip = (currentPage - 1) * limit;

        // If no documents match the search criteria, return empty array and empty pagination info
        if (totalDocuments === 0) {
            res.status(200).json({ documents: [], paginationInfo: {} });
            return;
        }
        const paginatedDocuments = await ContactUsModel.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const paginatedInfo = {
            currentPage,
            totalPages,
            pageSize: limit,
            totalItems: totalDocuments
        }
        res.status(200).json({ documents: paginatedDocuments, paginatedInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { Insert, GetAll };