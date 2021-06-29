class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            'total_amount': 1000
        }
    }
    render(){
        return(
            <div>
                <h1> Lottery Application</h1>
                <div> Total Lottery Amount is {this.state.total_amount}</div>
                <form>
                    <input placeholder='amount'></input>
                    <input placeholder='email'></input>
                    <button>Participate</button>
                </form>
            </div>
        )
    }
}

ReactDOM.render(<div><App/></div>, document.getElementById('root'));