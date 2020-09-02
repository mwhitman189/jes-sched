import { useState } from 'react';

function useToggle(initialVal = false) {
  const [isToggled, setIsToggled] = useState(initialVal);
  const toggle = () => {
    setIsToggled(!isToggled);
  };
  return [isToggled, toggle];
}
export default useToggle;
