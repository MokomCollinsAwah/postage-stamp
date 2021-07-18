import React, { useEffect, useState } from "react";
import "./App.css";

const initialState = {
  stamps: [],
  purchases: [],
  postageAmount: 0,
  optimalSelection: [],
};

function App() {
  const [state, setState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      // Fetch postage stamps from the backend API using fetch method
      const response = await fetch("http://localhost:8080/postage-stamps");
      const stamps = await response.json();

      // Update the state with the stamps coming rom the endpoint
      setState((prevState) => ({
        ...prevState,
        stamps,
      }));
    })();
  }, []);

  const onChange = (e) => {
    e.persist();
    setState((prevState) => ({
      ...prevState,
      postageAmount: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const response = await fetch(
      "http://localhost:8080/postage-stamps/optimal-selection",
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ postageAmount: state.postageAmount }),
      }
    );
    const result = await response.json();
    setState((prevState) => ({ ...prevState, optimalSelection: result }));
    setIsSubmitting(false);
  };

  const handlePurchase = async () => {
    const purchase = await fetch(
      "http://localhost:8080/postage-stamps/purchases",
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
          postage_amount: state.postageAmount,
          postage_stamps: state.optimalSelection,
        }),
      }
    );
    console.log(purchase);
  };

  return (
    <div className="App">
      <h1>Postage stamp exercise</h1>
      <form onSubmit={onSubmit} className="w-50 p-5 mx-auto">
        <div class="form-group">
          <label htmlFor="postageAmount">Postage amount</label>
          <input
            type="number"
            class="form-control"
            value={state.postageAmount}
            onChange={onChange}
            id="postageAmount"
            placeholder="Enter postage amount"
          />
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          class="btn btn-primary my-3"
        >
          Submit
        </button>
      </form>
      <div className="d-flex flex-row">
        <div className="border w-50 mx-2 min-vh-100 p-3">
          <h3>Available postage stamps</h3>
          {state.stamps.map((stamp) => (
            <div key={stamp._id} class="card m-3">
              <div class="card-body">
                <strong className="fs-5">{`${stamp.amount} Frs`}</strong>
                <h5>{stamp.stamp_name}</h5>
                <p>{stamp.description}</p>
                <div>
                  Quantity:
                  <strong>{` ${stamp.quantity}`}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border w-50 mx-2 min-vh-100 p-3">
          <h3>Minimum optimal selections</h3>
          {Boolean(state.optimalSelection.length) &&
            state.optimalSelection.map((stamp) => (
              <div key={stamp._id} class="card m-3">
                <div class="card-body">
                  <strong className="fs-5">{`${stamp.amount} Frs`}</strong>
                  <h5>{stamp.stamp_name}</h5>
                  <p>{stamp.description}</p>
                  <div>
                    Quantity:
                    <strong>{` ${stamp.quantity}`}</strong>
                  </div>
                </div>
              </div>
            ))}
          <button className="btn btn-secondary" onClick={handlePurchase}>
            Purchase stamps
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
