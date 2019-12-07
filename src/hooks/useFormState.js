import { useState } from "react";

export default initialVal => {
  const [value, setValue] = useState(initialVal);
  const handleChange = e => {
    if (e.target) {
      setValue(e.target.value);
    } else {
      setValue(e);
    }
  };
  const reset = () => {
    setValue("");
  };
  return [value, handleChange, reset];
};
