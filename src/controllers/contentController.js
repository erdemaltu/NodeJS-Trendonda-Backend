const Content = require("../models/Content");
const slugify = require("slugify");

exports.createContent = async (req, res, next) => {
    try {
      const { title, description, content, category, tags, status } = req.body;
  
      // Slug oluştur ve çakışmayı önlemek için kontrol et
      let slug = slugify(title, { lower: true, strict: true });
      const existingContent = await Content.findOne({ slug });
      if (existingContent) {
        slug = `${slug}-${Date.now()}`;
      }
  
      const newContent = new Content({
        title,
        slug,
        description,
        content,
        category,
        tags,
        status,
        author: req.user._id, // Mevcut kullanıcıyı bağla
      });
  
      await newContent.save();
  
      res.status(201).json({ message: 'İçerik başarıyla oluşturuldu', content: newContent });
    } catch (error) {
        next(error);
    }
  };

// Tüm içerikleri listeleme
exports.getAllContents = async (req, res, next) => {
  try {
    const contents = await Content.find()
      .populate("author", "name email")
      .populate("category", "name slug")
      .populate("tags", "name slug");

    res.status(200).json(contents);
  } catch (error) {
    next(error);
  }
};

// Tek bir içeriği getirme
exports.getContentById = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate("author", "name email")
      .populate("category", "name slug")
      .populate("tags", "name slug");

    if (!content) {
      return res.status(404).json({ message: "İçerik bulunamadı" });
    }

    // Görüntüleme sayısını artır
    content.viewCount += 1;
    await content.save();

    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

// İçerik güncelleme
exports.updateContent = async (req, res, next) => {
  try {
    const { title, description, content, category, tags, status } = req.body;

    // Slug yeniden oluşturulabilir
    const slug = title
      ? slugify(title, { lower: true, strict: true })
      : undefined;

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug,
        description,
        content,
        category,
        tags,
        status,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ message: "İçerik bulunamadı" });
    }

    res.status(200).json(updatedContent);
  } catch (error) {
    next(error);
  }
};

// İçerik silme
exports.deleteContent = async (req, res, next) => {
  try {
    const deletedContent = await Content.findByIdAndDelete(req.params.id);

    if (!deletedContent) {
      return res.status(404).json({ message: "İçerik bulunamadı" });
    }

    res.status(200).json({ message: "İçerik silindi" });
  } catch (error) {
    next(error);
  }
};
