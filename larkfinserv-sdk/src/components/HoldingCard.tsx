import React from "react";
import { Fund } from "../types";

interface HoldingCardProps {
  fund: Fund;
  expandedHolding: string | null;
  toggleHoldingExpansion: (schemeCode: string) => void;
  isEligible: boolean;
}

const HoldingCard: React.FC<HoldingCardProps> = ({
  fund,
  expandedHolding,
  toggleHoldingExpansion,
  isEligible,
}) => {
  return (
    <div
      key={fund.schemeCode}
      className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleHoldingExpansion(fund.schemeCode)}
      >
        <div>
          <h4 className="font-medium text-gray-800">{fund.schemeName}</h4>
          <p className="text-sm text-gray-500">
            {fund.availableUnits} units @ ₹{fund.nav}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">
            ₹{parseFloat(fund.currentMktValue).toLocaleString()}
          </p>
          {isEligible ? (
            <p className="text-xs text-green-500">Eligible</p>
          ) : (
            <p className="text-xs text-red-500">Not eligible</p>
          )}
        </div>
      </div>

      {expandedHolding === fund.schemeCode && (
        <div className="mt-2 pl-2 border-l-2 border-green-200">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">AMC</p>
              <p>{fund.amcName}</p>
            </div>
            <div>
              <p className="text-gray-500">Investor</p>
              <p>{fund.investorName}</p>
            </div>
            <div>
              <p className="text-gray-500">Cost Value</p>
              <p>₹{fund.costValue}</p>
            </div>
            <div>
              <p className="text-gray-500">Current Value</p>
              <p>₹{fund.currentMktValue}</p>
            </div>
            <div>
              <p className="text-gray-500">Gain/Loss</p>
              <p
                className={
                  parseFloat(fund.gainLoss) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                ₹{fund.gainLoss} ({fund.gainLossPercentage}%)
              </p>
            </div>
            <div>
              <p className="text-gray-500">Bank Account</p>
              <p>
                {fund.bank.name} ({fund.bank.accountNo})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoldingCard;
