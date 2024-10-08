const Dropdown = ({ options, onSelect }) => {
    return (
      <select onChange={(e) => onSelect(e.target.value)}>
        <option value="">Select a cryptocurrency</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };
  
  export default Dropdown;
  