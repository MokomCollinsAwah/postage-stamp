import Stamp from "../models/PostageStamp";

//function to find the minimum number of stamps
function getMinStamps(amount, stamps) {
  const size = stamps.length;
  const c = [amount + 1];
  const s = [amount + 1];
  c[0] = 0;
  for (let j = 1; j <= amount; j++) {
    c[j] = amount + 1;
    for (let i = 0; i < size; i++) {
      if (j >= stamps[i] && 1 + c[j - stamps[i]] < c[j]) {
        c[j] = 1 + c[j - stamps[i]];
        s[j] = i;
      }
    }
  }
  return {
    min: c[amount],
    s,
  };
}

//function to print the purchased stamps
function getPurchasedStamps(leastAmount, postageAmount, stampAmounts, s, data) {
  let i = 0;
  const d = stampAmounts;
  console.log("==================>>", d, s);
  const amounts = [];
  while (i < leastAmount) {
    const stamp = data.find((stmp) => stmp.amount === d[s[leastAmount]]);
    amounts.push(stamp);
    leastAmount = leastAmount - stampAmounts[s[leastAmount]];
    i++;
  }
  return amounts;
}

//function to test if the amount can be determined
function getLeastExpensiveAmount(postageAmount) {
  //get the second digit of the postageAmount
  var digit = Math.floor((postageAmount / 10) % 10);
  let leastAmount = 0;

  if (postageAmount % 10 == 0 && (digit == 5 || digit == 0)) {
    return postageAmount;
  } else if (digit == 5 || digit == 6 || digit == 7 || digit == 8 || digit == 9) {
    leastAmount = Math.ceil(postageAmount / 100) * 100;
    return leastAmount;
  } else {
    leastAmount = Math.ceil(postageAmount / 50) * 50;
    return leastAmount;
  }
}

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

    try {
      const postageStamps = await Stamp.find();

      if (!postageAmount) {
        return res.status(200).send([]);
      }

      // Extract an array of stamp amounts from the array of stamp objects coming from the database
      const stampAmounts = postageStamps.map((stamp) => stamp.amount);
      const newAmount = getLeastExpensiveAmount(postageAmount);
      const { min, s } = getMinStamps(newAmount, stampAmounts);
      const stamps = getPurchasedStamps(newAmount, postageAmount, stampAmounts, s, postageStamps);

      return res.status(200).send({ leastAmount: newAmount, minStamps: min, stamps, postageAmount });
    } catch (error) {
      return next(next);
    }
  },

  async fetchAllStamps(req, res, next) {
    try {
      const stamps = await Stamp.find({}).populate({ path: "purchase" });

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
  },
};

export default postageStampController;
