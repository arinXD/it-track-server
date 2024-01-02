var express = require('express');
var router = express.Router();
const models = require('../models');
const Program = models.Program

router.get("/", async (req, res) => {
    try {
        const programs = await Program.findAll();
        return res.status(200).json({
            ok: true,
            data: programs
        });
    } catch (error) {
        console.error('Error fetching programs:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/insertProgram", async (req, res) => {
    try {
        const { program_title } = req.body;

        const newProgram = await Program.create({
            program_title: program_title,
        });

        return res.status(201).json({
            ok: true,
            data: newProgram
        });
    } catch (error) {
        console.error('Error inserting program:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const programId = req.params.id;
        const program = await Program.findByPk(programId);

        if (!program) {
            return res.status(404).json({
                ok: false,
                error: 'Program not found'
            });
        }

        return res.status(200).json({
            ok: true,
            data: program
        });
    } catch (error) {
        console.error('Error fetching program:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/updateProgram/:id", async (req, res) => {
    try {
        const programId = req.params.id;
        const { program_title } = req.body;

        if (!program_title) {
            return res.status(400).json({
                ok: false,
                error: 'program_title is required in the request body'
            });
        }

        const existingProgram = await Program.findByPk(programId);

        if (!existingProgram) {
            return res.status(404).json({
                ok: false,
                error: 'Program not found'
            });
        }

        await existingProgram.update({
            program_title: program_title,
            // Add other fields as needed
        });

        return res.status(200).json({
            ok: true,
            data: existingProgram
        });
    } catch (error) {
        console.error('Error updating program:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.delete("/deleteProgram/:id", async (req, res) => {
    try {
        const programId = req.params.id;

        const result = await Program.destroy({
            where: {
                id: programId
            }
        });

        if (result === 0) {
            return res.status(404).json({
                ok: false,
                error: 'Program not found'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Program deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting Program:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});


module.exports = router