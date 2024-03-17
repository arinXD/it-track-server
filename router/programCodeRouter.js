var express = require('express');
var router = express.Router();
const models = require('../models');
const ProgramCode = models.ProgramCode
const { Op } = require('sequelize');

router.get("/", async (req, res) => {
    try {
        const programcodes = await ProgramCode.findAll();
        return res.status(200).json({
            ok: true,
            data: programcodes
        });
    } catch (error) {
        console.error('Error fetching programcodes:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/getrestore", async (req, res) => {
    try {
        const deletedProgramCodes = await ProgramCode.findAll({
            paranoid: false,
            where: {
                deletedAt: {
                    [Op.not]: null
                }
            }
        });

        return res.status(200).json({
            ok: true,
            data: deletedProgramCodes
        });
    } catch (error) {
        console.error('Error fetching deleted program codes:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/restoreProgramCode/:id", async (req, res) => {
    try {
        const programCodeId = req.params.id;

        const deletedProgramCode = await ProgramCode.findOne({
            where: {
                id: programCodeId,
                deletedAt: { [Op.not]: null }
            },
            paranoid: false
        });

        if (!deletedProgramCode) {
            return res.status(404).json({
                success: false,
                error: 'Deleted program code not found'
            });
        }

        await deletedProgramCode.restore();

        return res.status(200).json({
            success: true,
            message: 'Program code restored successfully'
        });
    } catch (error) {
        console.error('Error restoring program code:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});


router.post("/insertProgramCode", async (req, res) => {
    try {
        const {program_code, desc, version, program } = req.body;

        const newProgramCode = await ProgramCode.create({
            program_code: program_code,
            desc: desc,
            version: version,
            program: program,
        });

        return res.status(201).json({
            ok: true,
            data: newProgramCode
        });
    } catch (error) {
        console.error('Error inserting ProgramCode:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const programcodeId = req.params.id;
        const programcode = await ProgramCode.findByPk(programcodeId);


        return res.status(200).json({
            ok: true,
            data: programcode
        });
    } catch (error) {
        console.error('Error fetching programcode:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/updateProgramCode/:id", async (req, res) => {
    try {
        const programcodeId = req.params.id;
        const { program_code, desc, version, program } = req.body;
        
        const existingProgramCode = await ProgramCode.findByPk(programcodeId);
        
        if (!existingProgramCode) {
            return res.status(404).json({
                ok: false,
                error: 'Program not found'
            });
        }
        
        await existingProgramCode.update({
            program_code: program_code,
            desc: desc,
            version: version,
            program: program,
            // Add other fields as needed
        });

        return res.status(200).json({
            ok: true,
            data: existingProgramCode
        });
    } catch (error) {
        console.error('Error updating programcode:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.delete("/deleteProgramCode/:id", async (req, res) => {
    try {
        const programCode = req.params.id;

        const result = await ProgramCode.destroy({
            where: {
                program_code: programCode
            }
        });

        if (result === 0) {
            return res.status(404).json({
                success: false,
                error: 'ProgramCode not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'ProgramCode deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting ProgramCode:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

module.exports = router

// router.post("/insertProgramCode", async (req, res) => {
//     try {
//         const { program_code, desc, version, program } = req.body;

//         // Check if a soft-deleted or active record with the given program_code exists
//         let existingProgramCode = await ProgramCode.findOne({
//             where: {
//                 program_code: program_code,
//                 deletedAt: { [Op.not]: null } // Find soft-deleted records
//             },
//             paranoid: false // Include soft-deleted records
//         });

//         if (existingProgramCode) {
//             if (existingProgramCode.deletedAt !== null) {
//                 // If a soft-deleted record exists, restore it
//                 await existingProgramCode.restore();
//                 // Update the restored record with the new information
//                 await existingProgramCode.update({
//                     desc: desc,
//                     version: version,
//                     program: program
//                     // Add other fields as needed
//                 });
//                 return res.status(200).json({
//                     ok: true,
//                     data: existingProgramCode,
//                     message: 'Restored previously soft-deleted program code and updated'
//                 });
//             } else {
//                 // If an active record exists, update it with the new information
//                 await existingProgramCode.update({
//                     desc: desc,
//                     version: version,
//                     program: program
//                     // Add other fields as needed
//                 });
//                 return res.status(200).json({
//                     ok: true,
//                     data: existingProgramCode,
//                     message: 'Updated existing program code'
//                 });
//             }
//         } else {
//             // If no record exists, create a new one
//             const newProgramCode = await ProgramCode.create({
//                 program_code: program_code,
//                 desc: desc,
//                 version: version,
//                 program: program
//             });

//             return res.status(201).json({
//                 ok: true,
//                 data: newProgramCode,
//                 message: 'Inserted new program code'
//             });
//         }
//     } catch (error) {
//         console.error('Error inserting/updating ProgramCode:', error);
//         return res.status(500).json({
//             ok: false,
//             error: 'Internal Server Error'
//         });
//     }
// });