import postageStampController from "./controllers/stamps"
import purchaseController from './controllers/purchase';

const routes = (app) => {
  // Postage stamp endpoints
  app.post('/postage-stamps', postageStampController.createStamp);
  app.get('/postage-stamps', postageStampController.fetchAllStamps);
  app.get('/postage-stamps/available', postageStampController.fetchAvailableStamps)
  app.get('/postage-stamps/purchased', postageStampController.fetchPurchasedStamps)
  app.patch('/postage-stamps/:stampId', postageStampController.updateStamp)

  // Purchase endpoints
  app.post("/postage-stamps/purchases", purchaseController.createPurchase);
  app.get("/postage-stamps/purchases", purchaseController.fetchAllPurchases);
  app.get("/postage-stamps/purchases/:id", purchaseController.fetchOnePurchase);
};

export default routes;
