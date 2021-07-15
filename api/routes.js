import postageStampController from "./controllers/stamps"

const routes = (app) => {
  app.post('/postage-stamps', postageStampController.createStamp);

  app.get('/postage-stamps', postageStampController.fetchAllStamps);

  app.get('/postage-stamps/available', postageStampController.fetchAvailableStamps)

  app.get('/postage-stamps/purchased', postageStampController.fetchPurchasedStamps)

  app.patch('/postage-stamps/:stampId', postageStampController.updateStamp)
};

export default routes;
