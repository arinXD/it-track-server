const models = require('../models');
const fs = require('fs');
const path = require('path');
const { getHostname } = require('../api/hostname');

const getAllPublishedNews = async (req, res) => {
     try {
          const { id } = req.params;
          if (id) {
               const news = await models.News.findOne({
                    where: {
                         id,
                         published: true
                    }
               });
               if (!news) {
                    return res.status(404).json({ message: "News not found" });
               }
               return res.status(200).json(news);
          }
          const news = await models.News.findAll({
               order: [['updatedAt', 'DESC']],
               where: {
                    published: true
               }
          });
          return res.status(200).json(news);
     } catch (error) {
          return res.status(500).json({ message: "Error fetching news", error: error.message });
     }
}
const getAllNews = async (req, res) => {
     try {
          const { id } = req.params;
          if (id) {
               const news = await models.News.findByPk(id);
               if (!news) {
                    return res.status(404).json({ message: "News not found" });
               }
               return res.status(200).json(news);
          }
          const news = await models.News.findAll({
               order: [['createdAt', 'DESC']],
          });
          return res.status(200).json(news);
     } catch (error) {
          return res.status(500).json({ message: "Error fetching news", error: error.message });
     }
}

const createNews = async (req, res) => {
     try {
          const { title, desc, detail, published } = req.body;
          const image = req.file ? `images/news/${req.body.fileName}` : null;

          const news = await models.News.create({
               title,
               desc,
               detail,
               published,
               image: `${getHostname()}/${image}`
          });

          return res.status(201).json(news);
     } catch (error) {
          console.log(error);
          return res.status(500).json({ message: "Error creating news", error: error.message });
     }
}
const uploadImage = async (req, res) => {
     try {
          const image = req.file ? `images/news/${req.body.fileName}` : null;
          const imageUrl = `${getHostname()}/${image}`
          res.status(201).json({
               ok: true,
               imageUrl
          });
     } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error creating news", error: error.message });
     }
}

const updateNews = async (req, res) => {

     try {
          const { id } = req.params;
          const { title, desc, detail, published } = req.body;
          console.log(detail);

          let updateData = { title, desc, detail: detail[0], published };

          if (req.file) {
               updateData.image = `${getHostname()}/images/news/${req.body.fileName}`;
          }

          const [updated] = await models.News.update(updateData, {
               where: { id: id }
          });

          if (updated) {
               const updatedNews = await models.News.findByPk(id);
               return res.status(200).json(updatedNews);
          }

          return res.status(404).json({ message: 'News not found' });
     } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Error updating news", error: error.message });
     }
}

const publishNews = async (req, res) => {
     const { id } = req.params;
     try {
          const newsItem = await models.News.findByPk(id);

          if (newsItem) {
               const updated = await newsItem.update(
                    { published: !newsItem?.dataValues?.published }
               );

               if (updated) {
                    return res.status(200).json({
                         message: `News ${newsItem.published ? 'published' : 'unpublished'} successfully`,
                    });
               }
          }

          return res.status(404).json({ message: 'News not found' });
     } catch (error) {
          return res.status(500).json({ message: "Error updating news", error: error.message });
     }
};


const deleteMultipleNews = async (req, res) => {
     try {
          const ids = req.body

          if (!ids || !Array.isArray(ids)) {
               return res.status(400).json({ message: "Invalid input. Provide an array of ids." });
          }

          const newsToDelete = await models.News.findAll({
               where: { id: ids },
               attributes: ['id', 'image']
          });

          newsToDelete.forEach(news => {
               if (news.image) {
                    const fileName = news?.image?.split('/')?.pop()
                    if (fileName === "default_track_select.jpeg") return
                    const filePath = path.join(__dirname, `../public/images/news/${fileName}`);
                    if (fs.existsSync(filePath)) {
                         fs.unlinkSync(filePath);
                    }
               }
          });

          const deleted = await models.News.destroy({
               where: { id: ids }
          });

          return res.status(200).json({ message: `${deleted} news items and their associated images deleted successfully` });
     } catch (error) {
          return res.status(500).json({ message: "Error deleting news", error: error.message });
     }
}


module.exports = {
     getAllPublishedNews,
     getAllNews,
     createNews,
     uploadImage,
     updateNews,
     publishNews,
     deleteMultipleNews,
}