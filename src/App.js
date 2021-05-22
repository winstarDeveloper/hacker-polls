import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Header from "./components/Header";
import Main from "./components/Main";
import Login from "./components/Login";
import NotFound from "./components/NotFound";

import * as URL from "./utils/api_urls";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      message: "",
      hackers: [],
    };
  }

  async componentDidMount() {
    // window.localStorage.clear();

    // Receive data from server
    try {
      const hackers_data_url = URL.HackersDataURL;
      const response = await fetch(hackers_data_url);
      const data = await response.json();
      this.setState({ hackers: data.data, loading: false, message: "" });
    } catch (err) {
      this.setState({ hackers: [], loading: true, message: err.message });
    }
    // console.log("Hackers: ", this.state.hackers);
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Main hackers={this.state.hackers} />}
          />
           <Route
            exact
            path="/login"
            render={() => <Login />}
          />
          <Route render={() => <NotFound />} />
        </Switch>
      </div>
    );
  }
}
