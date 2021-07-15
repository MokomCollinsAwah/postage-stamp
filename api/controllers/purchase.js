import Purchase from "../models/Purchase"

const purchaseController = {
  async createPurchase(req, res, next) {
    const { postage_amount, postage_stamp_Ids } = req.body;

    try {
      const purchaseInstance = new Purchase({
        postage_amount,
      });
      if (postage_stamp_Ids?.length) {
        postage_stamp_Ids.forEach((purchase) =>
          purchaseInstance.postage_stamps.push(purchase)
        );
      }
      const purchase = await purchaseInstance.save();
      return res.status(201).send(purchase);
    } catch (error) {
      return next(error);
    }
  },

  async fetchOnePurchase(req, res, next) {
    const { id } = req.params;

    try {
      const purchase = await Purchase.findById(id)
        .populate("postage_stamps")
      return res.status(200).send(purchase);
    } catch (error) {
      return next(error);
    }
  },

  async fetchAllPurchases(req, res, next) {
    try {
      const purchases = await Purchase.find({}).populate('postage_stamps').exec();
      return res.status(200).send(purchases);
    } catch (error) {
      return next(error)
    }
  }
}

export default purchaseController;