import Tags from "../models/Tags";

// Lấy tất cả các tags
const getAllTags = async (req, res) => {
  try {
    const tags = await Tags.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Lấy một tag dựa trên ID
const getTagById = async (req, res) => {
  try {
    const tag = await Tags.findById(req.params.tagId);
    if (!tag) {
      return res.status(404).json({ error: "Không tìm thấy tag" });
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Tạo một tag mới
const createTag = async (req, res) => {
  try {
    const { title } = req.body;
    const tag = new Tags({ title });
    await tag.save();
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Cập nhật thông tin của một tag
const updateTag = async (req, res) => {
  try {
    const { title } = req.body;
    const tag = await Tags.findById(req.params.tagId);
    if (!tag) {
      return res.status(404).json({ error: "Không tìm thấy tag" });
    }
    tag.title = title;
    await tag.save();
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Xóa một tag
const deleteTag = async (req, res) => {
  try {
    const tag = await Tags.findById(req.params.tagId);
    if (!tag) {
      return res.status(404).json({ error: "Không tìm thấy tag" });
    }
    await tag.remove();
    res.json({ message: "Tag đã được xóa" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export { getAllTags, getTagById, createTag, updateTag, deleteTag };
