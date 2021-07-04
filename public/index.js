class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            'total_amount': 1000,
            'email': ''
        }
    }

    onSubmit = async (event)=>{
        event.preventDefault();
        const response = await axios.post('/post_info', {
            amount: this.state.amount,
            email: this.state.email
        })
        console.log(response)
        window.location.href = response.data;
    }

    async componentDidMount(){
        const result = await axios.get('/get_total_amount');
        this.setState({total_amount: result.data[0].total_amount});
    }
    render(){
        return(
            <div>
                <h1> Lottery Application</h1>
                <div> Total Lottery Amount is {this.state.total_amount}</div>
                <form onSubmit={this.onSubmit}>
                    <input placeholder='amount' value={this.state.amount} onChange={event => this.setState({'amount': event.target.value})}></input>
                    <input placeholder='email' value={this.state.email} onChange={event => this.setState({'email': event.target.value})}></input>
                    <button type="submit">Participate</button>
                </form>
            </div>
        )
    }
}

ReactDOM.render(<div><App/></div>, document.getElementById('root'));