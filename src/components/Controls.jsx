import React, { useState } from "react";

const Controls = () => {
  const [bet, setBet] = useState(1);

  return (
    <div className="flex flex-col items-center justify-center">
      <label className="text-white">Bet Amount:</label>
      <input
        type="number"
        value={bet}
        onChange={(e) => setBet(parseInt(e.target.value))}
        className="p-2 border rounded text-black"
      />
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Place Bet</button>
    </div>
  );
};

export default Controls;
