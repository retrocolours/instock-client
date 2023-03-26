import "./AddNewInventoryItem.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ArrowBack from "../../assets/icons/arrow_back-24px.svg";
import ItemDetailsForm from "../../components/ItemDetailsForm/ItemDetailsForm";
import ItemAvailabilityForm from "../../components/ItemAvailabilityForm/ItemAvailabilityForm";

function AddNewInventoryItem() {
	//bring in Api address for axios calls
	const api = process.env.REACT_APP_BASEURL;
	const { v4 } = require("uuid");
	const navigate = useNavigate();

	//useState for all warehouses and inventories
	const [warehouses, setWarehouses] = useState([]);
	const [inventories, setInventories] = useState([]);
	// const [ outOfStock, setOutOfStock ] = useState("");

	//useState for all form inputs
	const [inputValues, setInputValues] = useState({
		instock: "Out of Stock",
		quantity: "0",
		selectWarehouse: "",
		itemName: "",
		desc: "",
		category: "",
	});

	//onChange function for all inputs of form
	const handleOnChange = (event) => {
		//create variables for checkbox radios
		const quantityWrapper = document.querySelector(".avail__quantity-wrap");
		const stockRadio = document.querySelectorAll(".avail__radio");

		//create true value if item in stock, false if out of stock
		let stockCheck = stockRadio[0].checked;

		//if item in stock then set instock inputValue and show quantity field
		if (stockCheck) {
			quantityWrapper.classList.remove("avail__out-of-stock");
		}
		//if item out of stock then set instock inputVluae and hide quantity field
		if (!stockCheck) {
			quantityWrapper.classList.add("avail__out-of-stock");
		}

		// remove error states
		if (inputValues.itemName !== '') {
			document.querySelector('.details__input').classList.remove('error')
			document.querySelector('.details__required').classList.remove('show') 
		}
		if (inputValues.desc !== '') document.querySelector('.details__desc-input').classList.remove('error')
		if (inputValues.quantity !== '') document.querySelector('.avail__input').classList.remove('error')
		if (inputValues.category !== '') document.querySelector('.details__select').classList.remove('error')
		if (inputValues.selectWarehouse !== '') document.querySelector('.avail__warehouse').classList.remove('error')

		//udpate inputValues
		const { name, value } = event.target;
		setInputValues({ ...inputValues, [name]: value });
		console.log(event.target.value);
	};

	//on load get warehouses and inventories
	useEffect(() => {
		getWarehouses();
		getInventories();
		//disable dependency request to avoid creating infinite loop
		// eslint-disable-next-line
	}, []);

	//api get call function to get warehouses 
	function getWarehouses() {
		axios
			.get(`${api}/warehouses`)
			.then((data) => {
				if (data) {
					setWarehouses(data.data);
				}
			})
			.catch((err) => {
				console.log("err: ", err);
				// navigate("/404");
			});
	}

	//api get call function to get inventories ==move function up later
	function getInventories() {
		axios
			.get(`${api}/inventories`)
			.then((data) => {
				if (data) {
					setInventories(data.data);
				}
			})
			.catch((err) => {
				console.log("err: ", err);
				// navigate("/404");e.target.videoDesc.value
			});
	}

	//removeDup example modified from a respons at https://stackoverflow.com/questions/54757902/remove-duplicates-in-an-array-using-foreach
	function removeDup(arr) {
		let result = [];
		arr.forEach((item) => {
			if (!result.includes(item.category)) result.push(item.category);
		});
		return result;
	}
	//categoryArray has all categories from inventories without duplicates
	const categoryArray = removeDup(inventories);

	//function to handle form submit
	function handleFormSubmit(e) {
		e.preventDefault();

		//validate inputs and add error classes if not complete
		if (inputValues.itemName === '') {
			document.querySelector('.details__input').classList.add('error')
			document.querySelector('.details__required').classList.add('show')
			return alert('Please enter an item name')
		}

		if (inputValues.desc === '') {
			document.querySelector('.details__desc-input').classList.add('error')
			return alert('Please enter an item description')
		}

		if (isNaN(inputValues.quantity) || inputValues.quantity === '') {
			document.querySelector('.avail__input').classList.add('error')
			return alert("Please enter a number for quantity");
		}
		if (inputValues.category === '') {
			document.querySelector('.details__select').classList.add('error')
			return alert("Please select a category");
		}

		if (inputValues.selectWarehouse === '') {
			document.querySelector('.avail__warehouse').classList.add('error')
			return alert("Please select a warehouse");
		}

		//set new id variable to be able to navigate to page after
		let newId = v4();

		axios
			.post(`${api}/inventories`, {
				id: newId,
				warehouse_id: inputValues.selectWarehouse,
				item_name: inputValues.itemName,
				description: inputValues.desc,
				category: inputValues.category,
				status: inputValues.instock,
				quantity: inputValues.quantity,
			})
			.then((response) => {
				alert(`Your new inventory item ${inputValues.itemName} has been added`);

				//reset form on successful submit
				e.target.reset();
				setInputValues({
					selectWarehouse: "",
					itemName: "",
					desc: "",
					category: "",
					instock: "Out of Stock",
					quantity: 0,
				});
				navigate(`/inventory/${newId}`);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	//function to handle form cancel
	function handleFormCancel(e) {
		e.preventDefault();
		document.querySelector("form").reset();
		setInputValues({
			selectWarehouse: "",
			itemName: "",
			desc: "",
			category: "",
			instock: "",
			quantity: 0,
		});
		navigate(-1)
	}

	return (
		<section className="container">
			<div className="heading">
				<Link className="heading__link" to={".."} onClick={(e) => {
						e.preventDefault();
						navigate(-1);
					}}
				>
					<img src={ArrowBack} alt="ArrowBackButton" />
				</Link>
				<h1 className="heading__title">Add New Inventory Item</h1>
			</div>
			<form className="form" onSubmit={handleFormSubmit}>
				<div className="form__component-container">
					<ItemDetailsForm
						categoryArray={categoryArray}
						handleOnChange={handleOnChange}
						inputValues={inputValues}
					/>
				</div>
				<div className="form__component-container">
					<ItemAvailabilityForm
						warehouses={warehouses}
						handleOnChange={handleOnChange}
						inputValues={inputValues}
					/>
				</div>
				<div className="form__button-wrapper">
					<div className="form__button-container">
						<button
							className="form__button form__button--1"
							to={".."}
							onClick={handleFormCancel}
						>
							Cancel
						</button>
						<button className="form__button form__button--2">+ Add Item</button>
					</div>
				</div>
			</form>
		</section>
	);
}

export default AddNewInventoryItem;
