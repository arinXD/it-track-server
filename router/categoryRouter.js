var express = require('express');
var router = express.Router();
const models = require('../models');
const Categorie = models.Categorie

router.get("/", async (req, res) => {
    try {
        const categories = await Categorie.findAll();
        return res.status(200).json({
            ok: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/insertCategory", async (req, res) => {
    try {
        const { category_title } = req.body;

        const newCategory = await Categorie.create({
            category_title: category_title,
        });

        return res.status(201).json({
            ok: true,
            data: newCategory
        });
    } catch (error) {
        console.error('Error inserting category:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

// Get a specific category by ID
router.get("/:id", async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Categorie.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({
                ok: false,
                error: 'Category not found'
            });
        }

        return res.status(200).json({
            ok: true,
            data: category
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

// Update a specific category by ID
router.put("/updateCategory/:id", async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { category_title } = req.body;

        const existingCategory = await Categorie.findByPk(categoryId);

        if (!existingCategory) {
            return res.status(404).json({
                ok: false,
                error: 'Category not found'
            });
        }

        await existingCategory.update({
            category_title: category_title,
            // Add other fields as needed
        });

        return res.status(200).json({
            ok: true,
            data: existingCategory
        });
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.delete("/deleteCategory/:id", async (req, res) => {
    try {
        const categoryId = req.params.id;

        const result = await Categorie.destroy({
            where: {
                id: categoryId
            }
        });

        if (result === 0) {
            return res.status(404).json({
                ok: false,
                error: 'Category not found'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});


module.exports = router;