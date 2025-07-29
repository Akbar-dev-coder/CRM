// const remove = async (Model, req, res) => {
//   // Find the document by id and delete it
//   let updates = {
//     removed: true,
//   };
//   // Find the document by id and delete it
//   const result = await Model.findOneAndUpdate(
//     {
//       _id: req.params.id,
//     },
//     { $set: updates },
//     {
//       new: true, // return the new result instead of the old one
//     }
//   ).exec();
//   // If no results found, return document not found
//   if (!result) {
//     return res.status(404).json({
//       success: false,
//       result: null,
//       message: 'No document found ',
//     });
//   } else {
//     return res.status(200).json({
//       success: true,
//       result,
//       message: 'Successfully Deleted the document ',
//     });
//   }
// };

// module.exports = remove;
// src/controllers/middlewaresControllers/remove.js
const Counter = require('@/models/appModels/Counter');
const remove = async (Model, req, res) => {
  try {
    const result = await Model.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found',
      });
    }

    // reorder the documents after deletion

    const remainingDocs = await Model.find({}).sort({ srNo: 1 });

    for (let i = 0; i < remainingDocs.length; i++) {
      remainingDocs[i].srNo = i + 1;
      await remainingDocs[i].save();
    }

    //update counter seq to new length

    await Counter.findOneAndUpdate(
      {
        entity: Model.modelName,
      },
      {
        $set: { seq: remainingDocs.length },
      },
      { upsert: true }
    );

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully deleted the document',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = remove;
