import Stamp from "../models/PostageStamp";

const postageStampController = {
  async createStamp(req, res, next) {
    const { stamp_name, description, isPurchased, amount, quantity } = req.body;

    try {
      const postageStampInstance = new Stamp({
        stamp_name,
        description,
        isPurchased,
        amount,
        quantity,
      });
      const postageStamp = await postageStampInstance.save();

      return res.status(201).send(postageStamp);
    } catch (error) {
      return next(error);
    }
  },

  async fetchStampsToBePurchased(req, res, next) {
    const { postageAmount } = req.body;
    console.log(req.body);
    
    try {
      const postageStamps = await Stamp.find({ quantity: 0 });

      let result = [];
      let factoredStamps = [];
      for (const stamp of postageStamps) {
        // If the postage amt equals the amount of one of the stamps, return one of the stamps
        if (postageAmount === stamp._doc.amount) {
          result = [{ ...stamp._doc, quantity: 1 }];
        }
      }

      for (const stamp of postageStamps) {
        if (postageAmount % stamp._doc.amount === 0) {
          result = [{ ...stamp._doc, quantity: postageAmount / stamp.amount }];
          factoredStamps = [...factoredStamps, ...result];
        }
      }

      if (factoredStamps.length) {
        const factoredQuantities = factoredStamps.sort((a, b) =>
          a.quantity < b.quantity ? -1 : 1
        );
        result = [factoredQuantities[0]];
      }

      // console.log(factoredStamps);
      return res.status(200).send(result);
    } catch (error) {
      return next(next);
    }
  },

  async fetchAllStamps(req, res, next) {
    try {
      const stamps = await Stamp.find({}).populate({ path: 'purchase' });

      return res.status(200).send(stamps);
    } catch (error) {
      return next(error);
    }
  },

  async fetchAvailableStamps(req, res, next) {
    try {
      const availableStamps = await Stamp.find({ quantity: 0 });

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
