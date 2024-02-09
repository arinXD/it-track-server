var express = require('express');
var router = express.Router();
const models = require('../models');
const ProgramCode = models.ProgramCode

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

router.post("/insertProgramCode", async (req, res) => {
    try {
        const { program_code, desc, version, program } = req.body;

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

router.get("/:program_code", async (req, res) => {
    try {
        const programcodeId = req.params.program_code;
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

router.post("/updateProgramCode/:program_code", async (req, res) => {
    try {
        const programcodeId = req.params.program_code;
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

router.delete("/deleteProgramCode/:program_code", async (req, res) => {
    try {
        const programCode = req.params.program_code;

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