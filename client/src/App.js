import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import store from "./store";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<Switch>
						<Route path="/" exact component={Home} />
						{/* More routes */}
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<Route path="/dashboard" component={Dashboard} />
						<Route render={() => <h1>404</h1>} />
					</Switch>
				</Router>
			</Provider>
		);
	}
}

export default App;
