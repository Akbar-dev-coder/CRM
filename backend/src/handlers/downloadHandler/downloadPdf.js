const custom = require('@/controllers/pdfController');
const mongoose = require('mongoose');

module.exports = downloadPdf = async (req, res, { directory, id }) => {
  try {
    let entity = directory;

    //map payroll -> payslip for admin donwload

    if (entity === 'payroll') {
      entity = 'payslip';
    }
    const modelName = entity.slice(0, 1).toUpperCase() + entity.slice(1);
    if (mongoose.models[modelName]) {
      const Model = mongoose.model(modelName);

      let result;

      // special handling for payslip to populated employee data

      if (modelName === 'Payslip') {
        result = await Model.findOne({
          _id: id,
        })
          .populate(
            'employeeId',
            'fullName employeeId email phone department designation basicSalary bankName bankAccountNumber bankIFSC panNo aadhaarNo joiningDate'
          )
          .exec();
      } else {
        result = await Model.findOne({
          _id: id,
        }).exec();
      }

      // Throw error if no result
      if (!result) {
        throw { name: 'ValidationError' };
      }

      // Continue process if result is returned

      const fileId = modelName.toLowerCase() + '-' + result._id + '.pdf';
      const folderPath = modelName.toLowerCase();
      const targetLocation = `src/public/download/${folderPath}/${fileId}`;
      await custom.generatePdf(
        modelName,
        { filename: folderPath, format: 'A4', targetLocation },
        result,
        async () => {
          return res.download(targetLocation, (error) => {
            if (error)
              return res.status(500).json({
                success: false,
                result: null,
                message: "Couldn't find file",
                error: error.message,
              });
          });
        }
      );
    } else {
      return res.status(404).json({
        success: false,
        result: null,
        message: `Model '${modelName}' does not exist`,
      });
    }
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        error: error.message,
        message: 'Required fields are not supplied',
      });
    } else if (error.name == 'BSONTypeError') {
      // If error is thrown by Mongoose due to invalid ID
      return res.status(400).json({
        success: false,
        result: null,
        error: error.message,
        message: 'Invalid ID',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        error: error.message,
        message: error.message,
        controller: 'downloadPDF.js',
      });
    }
  }
};
