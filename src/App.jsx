import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import MultiPlayerHeader from "./Components/MultiPlayerHeader";
import Test from "./Components/Test";
import TypingHome from "./Components/TypingHome";

function App() {
  return (
    <>
      {/* <Test/> */}

      <BrowserRouter>
        <TypingHome />
        <Routes>
          <Route index element={<MultiPlayerHeader />} />
          <Route
            path="/fast_fingers/:id"
            element={
              <>
                <Test />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
