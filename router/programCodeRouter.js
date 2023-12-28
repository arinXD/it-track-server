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
        const { program_title, desc, version, program_id } = req.body;

        const newProgramCode = await ProgramCode.create({
            program_title: program_title,
            desc: desc,
            version: version,
            program_id: program_id,
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

        if (!programcode) {
            return res.status(404).json({
                ok: false,
                error: 'ProgramCode not found'
            });
        }

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
        const { program_title, desc, version, program_id } = req.body;

        if (!program_title) {
            return res.status(400).json({
                ok: false,
                error: 'program_title is required in the request body'
            });
        }

        const existingProgramCode = await ProgramCode.findByPk(programcodeId);

        if (!existingProgramCode) {
            return res.status(404).json({
                ok: false,
                error: 'Program not found'
            });
        }

        await existingProgramCode.update({
            program_title: program_title,
            desc: desc,
            version: version,
            program_id: program_id,
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
        const programcodeId = req.params.id;

        const result = await ProgramCode.destroy({
            where: {
                id: programcodeId
            }
        });

        if (result === 0) {
            return res.status(404).json({
                ok: false,
                error: 'ProgramCode not found'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'ProgramCode deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting ProgramCode:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

module.exports = router