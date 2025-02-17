import Controls from "./Controls";


const SettingsButton = () => (
    <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors" title="Settings">
      <div className="w-6 h-6 bg-gray-400 rounded-full" />
    </button>
  );
  
  const BalanceDisplay = ({ amount }) => (
    <div className="text-yellow-500">
      <div className="text-sm">Balance</div>
      <div className="text-xl font-bold">{amount.toFixed(2)}</div>
    </div>
  );
  
  const WinDisplay = ({ amount }) => (
    <div className="text-yellow-500">
      <div className="text-sm">WIN</div>
      <div className="text-xl font-bold">{amount.toFixed(2)}</div>
    </div>
  );
  

const ControlPanel = ({ balance = 1988.30, win = 0.00, bet = 1 }) => {
    return (
      <div className="bg-gray-900 p-4 rounded-b-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SettingsButton />
          <BalanceDisplay amount={balance} />
        </div>
  
        <div className="flex items-center gap-4">
          <WinDisplay amount={win} />
          <Controls />
        </div>
      </div>
    );
  };

export default ControlPanel;    