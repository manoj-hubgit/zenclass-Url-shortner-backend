import shortid from "shortid";
import Url from "../Models/urlSchema.js";

export const createShortUrl = async (req, res) => {
  const { longUrl } = req.body;

  try {
    let url = await Url.findOne({ longUrl });
    if (url) {
      return res.json(url);
    }
    const urlCode = shortid.generate();
    const shortUrl = `https://shortner-backend-c4dw.onrender.com/api/url/${urlCode}`;
    url = new Url({
      longUrl,
      shortUrl,
      urlCode,
      date: new Date(),
    });
    await url.save();
    res.json(url);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server error");
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("No URL found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server error");
  }
};

export const getUrlStats = async (req, res) => {
  try {
    const dailyStats = await Url.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyStats = await Url.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ dailyStats, monthlyStats });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server error");
  }
};
