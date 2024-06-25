const models = require('../models');
const SuggestionForm = models.SuggestionForm
const { Op } = require('sequelize');

const getForms = async (req, res) => {
     try {
          const suggestForms = await SuggestionForm.findAll()
          return res.status(200).json({
               ok: true,
               data: suggestForms
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getFormByID = async (req, res) => {
     const id = req.params.id
     try {
          const suggestForms = await SuggestionForm.findOne({
               where:{ id }
          })
          return res.status(200).json({
               ok: true,
               data: suggestForms
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getAvailableForm = async (req, res) => {
     try {
          const suggestForms = await SuggestionForm.findOne({
               where: {
                    isAvailable: true
               }
          })
          return res.status(200).json({
               ok: true,
               data: suggestForms
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getDeletedForms = async (req, res) => {
     try {
          const suggestForms = await SuggestionForm.findAll({
               paranoid: false,
               where: {
                    deletedAt: {
                         [Op.not]: null
                    }
               },
          })
          return res.status(200).json({
               ok: true,
               data: suggestForms
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const createForm = async (req, res) => {
     const createData = req.body
     console.log(createData);
     try {
          const form = await SuggestionForm.create(createData)
          return res.status(200).json({
               ok: true,
               data: form
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const updateForm = async (req, res)=>{

}

const availableForm = async (req, res) => {
     const formId = req.params.id;
     let transaction
     try {
          transaction = await models.sequelize.transaction();

          const updatedForm = await SuggestionForm.update(
               { isAvailable: true },
               {
                    where: { id: formId },
                    returning: true,
                    transaction
               }
          );

          if (!updatedForm) {
               await transaction.rollback();
               return res.status(404).json({ message: 'Form not found.' });
          }

          await SuggestionForm.update(
               { isAvailable: false },
               {
                    where: {
                         id: { [Op.ne]: formId }
                    },
                    transaction
               }
          );

          await transaction.commit();

          return res.status(200).json({ message: 'Form availability updated.', form: updatedForm });

     } catch (error) {
          if (transaction) await transaction.rollback();

          console.error(error);
          return res.status(500).json({ message: 'Internal server error.' });
     }
};

const deleteForms = async (forms, force = false) => {
     for (let index = 0; index < forms.length; index++) {
          const id = forms[index];
          await SuggestionForm.destroy({
               where: {
                    id,
               },
               force
          })
     }
}

const deleteMultiple = async (req, res) => {
     const forms = req.body
     try {
          await deleteForms(forms, false)
          return res.status(200).json({
               ok: true,
               data: "ลบแบบฟอร์มสำเร็จ"
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const forceDeleteMultiple = async (req, res) => {
     const forms = req.body
     try {
          await deleteForms(forms, true)
          return res.status(200).json({
               ok: true,
               data: "ลบแบบฟอร์มสำเร็จ"
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

module.exports = {
     getForms,
     getFormByID,
     getAvailableForm,
     getDeletedForms,
     createForm,
     updateForm,
     availableForm,
     deleteMultiple,
     forceDeleteMultiple,
}