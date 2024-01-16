import "./index.css";
import React, { useState, useEffect } from "react";

export default function App() {
	const allOptions = ["Anupam", "Aditya", "Test", "Zepto", "Assignment", "New"];
	return <InputSearch suggestions={allOptions} />;
}

const InputSearch = ({ suggestions }) => {
	const [inputValue, setInputValue] = useState("");
	const [selectedItems, setSelectedItems] = useState([]);
	const [isFocused, setIsFocused] = useState(false);
	const [highlightedInput, setHighlightedInput] = useState(null);

	const filteredSuggestions = suggestions.filter(
		(suggestion) =>
			suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
			!selectedItems.includes(suggestion)
	);

	useEffect(() => {
		// Whenever the input value changes, un-highlight any highlighted Input
		if (inputValue !== "") {
			setHighlightedInput(null);
		}
	}, [inputValue]);

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Backspace" && inputValue === "") {
			if (highlightedInput !== null) {
				// Delete the highlighted Input
				const newSelectedItems = selectedItems.filter(
					(_, index) => index !== highlightedInput
				);
				setSelectedItems(newSelectedItems);
				setHighlightedInput(null);
			} else if (selectedItems.length > 0) {
				// Highlight the last Input
				setHighlightedInput(selectedItems.length - 1);
			}
		}
	};

	const handleSelectItem = (item) => {
		setSelectedItems([...selectedItems, item]);
		setInputValue("");
	};

	const handleDeleteItem = (item, index) => {
		setSelectedItems(
			selectedItems.filter((_, selectedIndex) => selectedIndex !== index)
		);
		setHighlightedInput(null);
	};

	const handleInputFocus = () => {
		setIsFocused(true);
	};

	const handleInputBlur = () => {
		setTimeout(() => {
			setIsFocused(false);
			setHighlightedInput(null);
		}, 200);
	};

	return (
		<div className="multi-select">
			<div className="selected-items">
				{selectedItems.map((item, index) => (
					<div
						key={index}
						className={`Input ${
							highlightedInput === index ? "highlighted" : ""
						}`}
						onClick={() => setHighlightedInput(index)}
					>
						{item}
						<span
							className="close"
							onClick={(e) => {
								e.stopPropagation(); // Prevent the Input click handler from firing
								handleDeleteItem(item, index);
							}}
						>
							&times;
						</span>
					</div>
				))}
				<input
					className="input"
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onFocus={handleInputFocus}
					onBlur={handleInputBlur}
					placeholder="Type to search..."
				/>
			</div>
			{isFocused && inputValue && filteredSuggestions.length > 0 && (
				<div className="suggestions">
					{filteredSuggestions.map((suggestion, index) => (
						<div
							key={index}
							className="suggestion"
							onMouseDown={() => handleSelectItem(suggestion)} // using onMouseDown instead of onClick to handle the focus/blur issue
						>
							{suggestion}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
