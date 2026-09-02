import React from "react";

import { passwordRules } from "../../../utils/passwordValidator";

const PasswordRequirements = ({ password = "" }) => {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm font-medium">
      {passwordRules.map((rule, index) => {
        const passed = rule.test(password);

        return (
          <React.Fragment key={rule.key}>
            {index > 0}
            <span
              className={`flex items-center gap-1 ${
                passed ? "text-emerald-600" : "text-gray-500"
              }`}
            >
              <span
                className={
                  passed
                    ? "text-emerald-600 font-bold"
                    : "text-red-500 font-bold"
                }
              >
                {passed ? "✓" : "✕"}
              </span>
              <span>{rule.shortLabel || rule.label}</span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PasswordRequirements;
