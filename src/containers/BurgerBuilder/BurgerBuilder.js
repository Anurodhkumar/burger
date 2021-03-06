import React,{ useState,useEffect } from 'react';
import { connect } from 'react-redux'
import Aux from '../../hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spiner from '../../components/UI/Spiner/Spiner'
 import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index';
const INGREDIENT_PRICES = {
	salad:0.5,
	cheese:0.4,
	meat:1.3,
	bacon:0.7
}

const burgerBuilder = props => {
	const [purchasing,setPurchasing] = useState(false)

	useEffect(() => {
		props.onInitIngredients();
	},[]);

	const updatePurchaseState = ingredients => {
		const sum = Object.keys(ingredients)
			.map(igKey => {
				return ingredients[igKey];
			})
			.reduce((sum,el) => {
				return sum+el;
			},0)
		return sum >0
	}

	const purchaseHandler =() => {
		if(props.isAuthenticated){
			setPurchasing(true)
		}
		else{
			props.onSetAuthRedirectPath('/checkout')
			props.history.push('/auth')
		}
	}
	const purchaseCancelHandler = () => {
		setPurchasing(false)
	}
	const purchaseContinueHandler = () =>{
		props.onInitPurchase();
		props.history.push('/checkout')
	}

	
	const disabledInfo = {
		...props.ings
	}
	for (let key in disabledInfo){
		disabledInfo[key] = disabledInfo[key] <= 0
	} 
	let orderSummary = null
	let burger = props.error ?<p>Ingredients can't be loaded</p>:<Spiner/>
	if(props.ings){
		burger = (
	<Aux>
	<Burger ingredients={props.ings}/>
			<BuildControls
				ingredientAdded={props.onIngredientAdded}
				ingredientRemoved={props.onIngredientRemoved}
				disabled = {disabledInfo}
				price={props.price}
				ordered={purchaseHandler}
				isAuth={props.isAuthenticated}
				purchasable={updatePurchaseState(props.ings)}/> 
	</Aux>	
	);
	orderSummary = <OrderSummary 
				ingredients={props.ings}
				price={props.price}
				purchaseCancelled={purchaseCancelHandler}
				purchaseContinued={purchaseContinueHandler}/>
	
	}
		return(
			<Aux>
			<Modal show={purchasing} modalClosed={purchaseCancelHandler}>  
				{orderSummary}
			</Modal>
			{burger}
			</Aux>
		) 
	
}

const mapStateToProps = state => {
	return{
		ings: state.burgerBuilder.ingredients,
		price:state.burgerBuilder.totalPrice,
		error:state.burgerBuilder.error,
		isAuthenticated:state.auth.token !==null
	}
}

const mapDispatchToProps = dispatch => {
	return{
		onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
		onInitIngredients:() => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath:(path) =>dispatch(actions.setAuthRedirectPath(path))
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler( burgerBuilder,axios));