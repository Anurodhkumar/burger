import axios from 'axios'
const instance = axios.create({
	baseURL:'https://react-my-burger-3c177-default-rtdb.firebaseio.com/'
})
export default instance