const express = require('express');
const router = express.Router();
const models = require('../models');
const Categorie = models.Categorie
const { Op } = require('sequelize');
const SubGroup = models.SubGroup
const Group = models.Group

const isAdmin = require("../middleware/adminMiddleware");
const isAuth = require('../middleware/authMiddleware');

router.get("/",isAdmin, async (req, res) => {
    try {
        const categories = await Categorie.findAll({
            include: [
                {
                    model: Group,
                    include: [
                        {
                            model: SubGroup
                        }
                    ]
                }
            ]
        });
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

router.get("/:categoryId/groups", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const groups = await Group.findAll({
            where: {
                category_id: categoryId
            },
            include: [
                {
                    model: SubGroup
                }
            ]
        });
        return res.status(200).json({
            ok: true,
            data: groups
        });
    } catch (error) {
        console.error('Error fetching groups by category ID:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/getrestore", async (req, res) => {
    try {
        const deletedCategories = await Categorie.findAll({
            paranoid: false,
            where: {
                deletedAt: {
                    [Op.not]: null
                }
            }
        });

        return res.status(200).json({
            ok: true,
            data: deletedCategories
        });
    } catch (error) {
        console.error('Error fetching deleted categories:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/restoreCategorie/:id", async (req, res) => {
    try {
        const categorieCodeId = req.params.id;

        const deletedCategorie = await Categorie.findOne({
            where: {
                id: categorieCodeId,
                deletedAt: { [Op.not]: null }
            },
            paranoid: false
        });

        if (!deletedCategorie) {
            return res.status(404).json({
                success: false,
                error: 'Deleted Categorie not found'
            });
        }

        await deletedCategorie.restore();

        return res.status(200).json({
            success: true,
            message: 'Categorie restored successfully'
        });
    } catch (error) {
        console.error('Error restoring Categorie:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/checkDuplicate/:title", async (req, res) => {
    try {
        const { title } = req.params;
        const category = await Categorie.findOne({
            where: {
                category_title: title
            }
        });

        // If category exists, return true
        if (category) {
            return res.status(200).json({
                exists: true
            });
        } else {
            return res.status(200).json({
                exists: false
            });
        }
    } catch (error) {
        console.error('Error checking duplicate category:', error);
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
        return res.status(500).json({
            ok: true,
            error: {}
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


router.delete('/selected', async (req, res) => {
    const { categoriesArr = [] } = req.body;
    try {
        let delCategorie = []
        for (const categories of categoriesArr) {
            delCategorie.push(categories)
            await Categorie.destroy({
                where: {
                    id: categories
                },
                force: true
            });
        }
        if (delCategorie.length == 0) {
            return res.status(200).json({
                ok: true,
                message: "ไม่มีหมวดหมู่ที่ถูกลบ"
            })
        } else {
            return res.status(200).json({
                ok: true,
                message: `ลบหมวดหมู่ ${delCategorie.join(", ")} เรียบร้อย`
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})


module.exports = router;