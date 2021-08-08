import seeder from "mongoose-seed";
import { config } from "dotenv";

config();

// Connect to MongoDB via Mongoose
seeder.connect(process.env.DATABASE_URL, function () {
  // Load Mongoose models
  seeder.loadModels(["api/models/PostageStamp.js", "api/models/Purchase.js"]);

  // Clear specified collections
  seeder.clearModels(["Postage_stamp", "Purchase"], function () {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });
  });
});

// Data array containing seed data - documents organized by Model
var data = [
  {
    model: "Postage_stamp",
    documents: [
      {
        amount: 100,
        isPurchased: false,
        quantity: 1,
        stamp_name: "My first stamp",
        description: "Description of My stamp",
        created_at: "2021-07-18T09:37:11.723Z",
        updated_at: "2021-07-18T13:09:48.765Z",
      },
      {
        amount: 500,
        isPurchased: false,
        quantity: 1,
        stamp_name: "My second stamp",
        description: "Description of My second stamp",
        created_at: "2021-07-18T09:37:58.601Z",
        updated_at: "2021-07-18T09:37:58.601Z",
      },
      {
        amount: 300,
        isPurchased: false,
        quantity: 1,
        stamp_name: "My third stamp",
        description: "Description of My third stamp",
        created_at: "2021-07-18T09:38:34.784Z",
        updated_at: "2021-07-18T09:38:34.784Z",
      },
      {
        amount: 50,
        isPurchased: false,
        quantity: 1,
        stamp_name: "My fourth stamp",
        description: "Description of My fourth stamp",
        created_at: "2021-07-18T09:47:42.683Z",
        updated_at: "2021-07-18T09:47:42.683Z",
      },
    ],
  },
];
