import { passwordRules } from "../../../utils/passwordValidator";

const PasswordRequirements = ({ password = "" }) => {
  return (
    <ul className="mt-2 space-y-1 text-sm">
      {passwordRules.map((rule) => {
        const passed = rule.test(password);

        return (
          <li
            key={rule.key}
            className={passed ? "text-green-600" : "text-gray-500"}
          >
            {passed ? "✓" : "○"} {rule.label}
          </li>
        );
      })}
    </ul>
  );
};

export default PasswordRequirements;
