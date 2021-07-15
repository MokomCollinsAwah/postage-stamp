import Stamp from "../models/PostageStamp";

const postageStampController = {
  async createStamp(req, res, next) {
    const { stamp_name, description, isPurchased, amount } = req.body;

    try {
      const postageStampInstance = new Stamp({
        stamp_name,
        description,
        isPurchased,
        amount,
      });
      const postageStamp = await postageStampInstance.save();

      return res.status(201).send(postageStamp);
    } catch (error) {
      return next(error);
    }
  },

  async fetchAllStamps(req, res, next) {
    try {
      const stamps = await Stamp.find({});

      return res.status(200).send(stamps);
    } catch (error) {
      return next(error);
    }
  },

  async fetchAvailableStamps(req, res, next) {
    try {
      const availableStamps = await Stamp.find({ isPurchased: false });

      return res.status(200).send(availableStamps);
    } catch (error) {
      return next(error);
    }
  },

  async fetchPurchasedStamps(req, res, next) {
    try {
      const purchasedStamps = await Stamp.find({ isPurchased: true });

      return res.status(200).send(purchasedStamps);
    } catch (error) {
      return next(error);
    }
  },

  async updateStamp(req, res, next) {
    const { stampId: id } = req.params;

    try {
      const postageStamp = await Stamp.findOneAndUpdate({ _id: id }, req.body);

      return res.status(200).send(postageStamp);
    } catch (error) {
      return next(error);
    }
  }
};

export default postageStampController;
