import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import { connect } from 'react-redux'
import ContactData from './ContactData/ContactData'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'

const checkout = props =>{
	
	
	const checkoutCancelledHandler = () =>{
		props.history.goBack()
	}

	const checkoutContinuedHandler = () => {
		props.history.replace('/checkout/contact-data')
	}
	
		let summary = <Redirect to="/" />
		
		if(props.ings){
			const purchaseRedirect = props.purchased ? <Redirect to="/" /> : null;
			summary = (
				<div>
					{purchaseRedirect}
					<CheckoutSummary 
					ingredients={props.ings}
					checkoutCancelled={checkoutCancelledHandler}
					checkoutContinued={checkoutContinuedHandler}/>
					<Route 
					path={props.match.path + '/contact-data'}
					component={ContactData} />
				</div>		
			)	
		}
		return summary;
	
}
const mapStateToProps = state => {
	return{
		ings:state.burgerBuilder.ingredients,
		purchased:state.order.purchased
	}
}

export default connect(mapStateToProps)(checkout)