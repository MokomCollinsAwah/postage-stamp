import React, { useEffect, useState } from "react";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import "./App.css";

const initialState = {
  stamps: [],
  purchases: [],
  postageAmount: 0,
  optimalSelection: {},
};

function App() {
  const [state, setState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false)
  const [purchase, setPurchase] = useState({})

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setState((prevState) => ({
        ...prevState,
        stamps: [],
      }));
      // Fetch postage stamps from the backend API using fetch method
      const response = await fetch("http://localhost:8080/postage-stamps");
      const stamps = await response.json();

      // Update the state with the stamps coming rom the endpoint
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          stamps,
        }));
        setIsLoading(false);
      }, 1000);
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
    const response = await fetch("http://localhost:8080/postage-stamps/optimal-selection", {
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
    });
    const result = await response.json();
    const optimal = result.stamps?.reduce((acc, currentValue) => {
      // console.log(acc);
      const stamp = acc.find((stmp) => stmp.amount === currentValue.amount);
      if (stamp) {
        currentValue.quantity += 1;
        acc = acc.map((val) => {
          if (val.amount === currentValue.amount) {
            return { ...val, quantity: val.quantity + 1 };
          }
          return val;
        });
      } else {
        acc = [...acc, currentValue];
      }
      return acc;
    }, []);
    console.log(optimal);
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        optimalSelection: {
          leastAmount: result.leastAmount,
          minStamps: result.minStamps,
          postageAmount: result.postageAmount,
          stamps: optimal,
        },
      }));
      setIsSubmitting(false);
    }, 1000);
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    const purchase = await fetch("http://localhost:8080/postage-stamps/purchases", {
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
        postage_stamps: state.optimalSelection.stamps,
      }),
    });
    setTimeout(() => {
      setPurchase(purchase)
      setIsPurchasing(false);
      setIsPurchased(true);
    }, 1000);
    console.log(purchase);
  };

  return (
    <div className="App mb-5">
      <h1>Postage stamp exercise</h1>
      <form onSubmit={onSubmit} className="w-50 p-5 mx-auto">
        <div className="form-group">
          <label htmlFor="postageAmount">Postage amount</label>
          <input
            type="number"
            className="form-control"
            value={state.postageAmount}
            onChange={onChange}
            id="postageAmount"
            placeholder="Enter postage amount"
          />
        </div>
        <button disabled={isSubmitting} type="submit" className="btn btn-primary my-3">
          {!isSubmitting && "Submit"}
          {isSubmitting && (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Loading...
            </>
          )}
        </button>
      </form>
      <div className="d-flex flex-row">
        <div className="border-custom overflow-auto w-50 mx-vh-75 mx-2 p-3">
          <h3>Available postage stamps</h3>
          {isLoading && (
            <div
              style={{ height: "400px" }}
              className="w-100 d-flex justify-content-center align-items-center"
            >
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {!isLoading &&
            state.stamps.map((stamp) => (
              <div key={stamp._id} className="card border-custom m-3">
                <div className="card-body">
                  <h5>{stamp.stamp_name}</h5>
                  <strong className="fs-5">{`${stamp.amount} Frs`}</strong>
                </div>
              </div>
            ))}
        </div>
        <div className="border-custom overflow-auto w-50 mx-vh-75 mx-2 p-3">
          {isSubmitting && (
            <div
              style={{ height: "400px" }}
              className="w-100 d-flex justify-content-center align-items-center"
            >
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {!isSubmitting && (
            <>
              {state.optimalSelection.stamps && (
                <>
                  <h4>Minimum number of stamps needed: {state.optimalSelection.minStamps}</h4>
                  {state.optimalSelection.postageAmount !== state.optimalSelection.leastAmount && (
                    <div className="d-flex flex-column align-items-center">
                      <h6 className="w-100 d-flex align-items-center justify-content-center">
                        <span style={{ fontSize: 15, marginRight: 5 }} className="material-icons">
                          info
                        </span>
                        There's no available stamps to equal the amount
                      </h6>
                      <h6>
                        The least expensive amount is: <strong>{state.optimalSelection.leastAmount}</strong>
                      </h6>
                    </div>
                  )}
                  <hr />
                </>
              )}
              <h4>Minimum optimal selections</h4>
              {Boolean(state.optimalSelection.stamps?.length) &&
                state.optimalSelection.stamps?.map((stamp) => (
                  <div key={stamp._id} className="card border-custom m-3">
                    <div className="card-body d-flex flex-column">
                      <h5>{stamp.stamp_name}</h5>
                      <strong className="fs-5">{`${stamp.amount} Frs`}</strong>
                      <small className="fs-6">{`Quatity: ${stamp.quantity}`}</small>
                    </div>
                  </div>
                ))}
              {Boolean(state.optimalSelection.stamps?.length) && (
                <button className="btn btn-secondary" onClick={handlePurchase}>
                  {!isPurchasing && "Purchase stamps"}
                  {isPurchasing && (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <ToastContainer className="p-3 position-fixed" position="top-end">
        <Toast onClose={() => setIsPurchased(false)} show={isPurchased} animation={false}>
          <Toast.Header>
            <strong className="me-auto">Purchase Stamp</strong>
          </Toast.Header>
          <Toast.Body className="d-flex align-items-center text-white">
            <span style={{ fontSize: 15 }} class="material-icons me-1">
              check_circle
            </span>
            Stamps puchased successfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default App;
