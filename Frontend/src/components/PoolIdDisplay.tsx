import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PoolIdDisplayProps {
  poolId: string;
}

const PoolIdDisplay = ({ poolId }: PoolIdDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(poolId);
    setCopied(true);
    toast.success("Pool ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPoolId = () => {
    return poolId.split("").map((char, index) => {
      const isNumber = /\d/.test(char);
      return (
        <span
          key={index}
          className={`font-mono font-bold text-2xl ${
            isNumber ? "text-vote-orange" : "text-vote-blue"
          }`}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <button
      onClick={copyToClipboard}
      className="flex items-center gap-3 px-6 py-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-200 group shadow-md hover:shadow-lg"
    >
      <div className="flex items-center tracking-widest">{renderPoolId()}</div>
      <div className="ml-2 p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
        {copied ? (
          <Check className="w-5 h-5 text-vote-success" />
        ) : (
          <Copy className="w-5 h-5 text-primary" />
        )}
      </div>
    </button>
  );
};

export default PoolIdDisplay;
