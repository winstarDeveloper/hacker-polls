import React, { Component } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import * as URL from "./../utils/api_urls";

// used session storage instead of persistent
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: "",
      token: JSON.parse(sessionStorage.getItem("token")) || "",
      loggedIn: false,
      option: 0,
      hackerData: {
        hacker_name: "",
        challenges_solved: 0,
        expertise: 0,
        fields: [],
      },
      field: "",
      value: 0,
      errMessage: "",
      resMessage: "",
      hackers: [],
      hacker_id: -1,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleAddHacker = this.handleAddHacker.bind(this);
    this.handleEditHacker = this.handleEditHacker.bind(this);
    this.handleDeleteHacker = this.handleDeleteHacker.bind(this);
  }

  componentDidMount() {
    this.setState({ loggedIn: this.state.token ? true : false });
  }

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  async handleLogin(e) {
    e.preventDefault();
    if (this.state.username === "" || this.state.password === "") {
      await this.setState({
        message: "Username and Password cannot be blank",
      });
      return;
    }

    try {
      const login_url = URL.LoginURL;
      const response = await fetch(login_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: this.state.username,
          password: this.state.password,
        }),
      });
      const data = await response.json();

      if (data.status !== "success") {
        await this.setState({ message: data.message, loggedIn: false });
      } else {
        await this.setState({ message: "", token: data.token, loggedIn: true });
        sessionStorage.setItem("token", JSON.stringify(this.state.token));
        window.location.reload(false);
      }
    } catch (err) {
      await this.setState({
        username: "",
        password: "",
        token: "",
        message: err.message,
        loggedIn: false,
      });
    }
    // console.log("Login: ", this.state.token);
  }

  handleOptionsAdd = () => {
    this.setState({ option: 0 });
  };

  handleOptionsEdit = () => {
    this.setState({ option: 1 });
    this.getAllHackers();
  };

  handleOptionsDelete = () => {
    this.setState({ option: 2 });
    this.getAllHackers();
  };

  viewTopVotes = () => {
    this.setState({ option: 3 });
    this.getAllHackers();
  };

  handleHackernameChange = (e) => {
    this.setState({
      hackerData: { ...this.state.hackerData, hacker_name: e.target.value },
    });
  };

  handleChallengesChange = (e) => {
    this.setState({
      hackerData: {
        ...this.state.hackerData,
        challenges_solved: e.target.value,
      },
    });
  };

  handleExpertiseChange = (e) => {
    this.setState({
      hackerData: { ...this.state.hackerData, expertise: e.target.value },
    });
  };

  handleFieldChange = (e) => {
    this.setState({ field: e.target.value });
  };

  handleFieldValueChange = (e) => {
    this.setState({ value: e.target.value });
  };

  handleAddingField = (e) => {
    e.preventDefault();
    if (
      this.state.field.length > 0 &&
      !isNaN(this.state.value) &&
      this.state.value > 0 &&
      this.state.value <= 5
    ) {
      this.setState({
        hackerData: {
          ...this.state.hackerData,
          fields: [
            ...this.state.hackerData.fields,
            {
              field: this.state.field,
              level: this.state.value,
            },
          ],
        },
        field: "",
        level: 0,
      });
      document.getElementById("field").value = "";
      document.getElementById("fieldvalue").value = "";
    } else {
      this.setState({
        errMessage:
          "Field must not be Empty and value must be a Number and ranging 1 to 5",
      });
    }
  };

  handleAddingFieldEdit = (e) => {
    e.preventDefault();
    if (
      this.state.field.length > 0 &&
      !isNaN(this.state.value) &&
      this.state.value > 0 &&
      this.state.value <= 5
    ) {
      this.setState({
        hackerData: {
          ...this.state.hackerData,
          fields: [
            ...this.state.hackerData.fields,
            {
              field: this.state.field,
              level: this.state.value,
            },
          ],
        },
        field: "",
        level: 0,
      });
      document.getElementById("fieldedit").value = "";
      document.getElementById("fieldvalueedit").value = "";
    } else {
      this.setState({
        errMessage:
          "Field must not be Empty and value must be a Number and ranging 1 to 5",
      });
    }
  };

  async handleAddHacker(e) {
    e.preventDefault();
    if (this.state.hackerData.hacker_name === "") {
      await this.setState({ errMessage: "Hacker must have a name" });
      return;
    } else if (
      isNaN(this.state.hackerData.challenges_solved) ||
      this.state.hackerData.challenges_solved === "" ||
      this.state.hackerData.challenges_solved <= 0
    ) {
      await this.setState({
        errMessage:
          "Challenges solved must not be empty and should be a Number",
      });
      return;
    } else if (
      isNaN(this.state.hackerData.expertise) ||
      this.state.hackerData.expertise <= 0 ||
      this.state.hackerData.expertise > 10
    ) {
      await this.setState({
        errMessage:
          "Expertise Level must not be empty and should be a Number ranging 1 to 10",
      });
      return;
    } else if (this.state.hackerData.fields.length <= 0) {
      await this.setState({
        errMessage: "There must be atleast 'One' entry for Expert-in field",
      });
      return;
    }

    try {
      const add_hacker_url = URL.AddHackerURL;
      const response = await fetch(add_hacker_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.token,
        },
        body: JSON.stringify(this.state.hackerData),
      });
      const data = await response.json();

      if (data.status !== "success") {
        await this.setState({
          resMessage: data.message,
        });
      } else {
        await this.setState({
          resMessage: data.message,
          hackerData: {
            hacker_name: "",
            challenges_solved: 0,
            expertise: 0,
            fields: [],
          },
          field: "",
          value: 0,
          errMessage: "",
        });
        document.getElementById("field").value = "";
        document.getElementById("fieldvalue").value = "";
        document.getElementById("hackername").value = "";
        document.getElementById("challengessolved").value = "";
        document.getElementById("expertise").value = "";
      }
    } catch (err) {
      await this.setState({
        hackerData: {
          hacker_name: "",
          challenges_solved: 0,
          expertise: 0,
          fields: [],
        },
        field: "",
        value: 0,
        errMessage: "",
        resMessage: "Caught Error : Reload the Page",
      });
    }
  }

  async getAllHackers() {
    try {
      const hackers_data_url = URL.HackersDataURL;
      const response = await fetch(hackers_data_url);
      const data = await response.json();
      await this.setState({ hackers: data.data, resMessage: "" });
    } catch (err) {
      await this.setState({
        hackers: [],
        resMessage: err.message + " : Reload the Page",
      });
    }
    // console.log("Hackers: ", this.state.hackers);
  }

  getOnlyHackerId = () => {
    const id = document.getElementById("select_hacker_id").value * 1;
    this.setState({ hacker_id: id });
  };

  getHackerId = () => {
    const id = document.getElementById("select_hacker").value * 1;
    this.setState({ hacker_id: id });
    // console.log(
      this.state.hackers
        .filter((i) => i.id === id)
        .map((j) => {
          document.getElementById("hackernameedit").value = j.hacker_name;
          document.getElementById("challengessolvededit").value =
            j.challenges_solved;
          document.getElementById("expertiseedit").value = j.expertise;
          this.setState({
            hackerData: {
              hacker_name: j.hacker_name,
              challenges_solved: j.challenges_solved,
              expertise: j.expertise,
              fields: j.fields,
            },
          });
          return 1;
        })
    // );
  };

  async handleEditHacker(e) {
    e.preventDefault();
    if (this.state.hackerData.hacker_name === "") {
      await this.setState({ errMessage: "Hacker must have a name" });
      return;
    } else if (
      isNaN(this.state.hackerData.challenges_solved) ||
      this.state.hackerData.challenges_solved === "" ||
      this.state.hackerData.challenges_solved <= 0
    ) {
      await this.setState({
        errMessage:
          "Challenges solved must not be empty and should be a Number",
      });
      return;
    } else if (
      isNaN(this.state.hackerData.expertise) ||
      this.state.hackerData.expertise <= 0 ||
      this.state.hackerData.expertise > 10
    ) {
      await this.setState({
        errMessage:
          "Expertise Level must not be empty and should be a Number ranging 1 to 10",
      });
      return;
    } else if (this.state.hackerData.fields.length <= 0) {
      await this.setState({
        errMessage: "There must be atleast 'One' entry for Expert-in field",
      });
      return;
    }

    try {
      const add_hacker_url = URL.UpdateHackerURL + this.state.hacker_id;
      const response = await fetch(add_hacker_url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.token,
        },
        body: JSON.stringify(this.state.hackerData),
      });
      const data = await response.json();

      if (data.status !== "success") {
        await this.setState({
          resMessage: data.message,
        });
      } else {
        await this.setState({
          resMessage: data.message,
          hackerData: {
            hacker_name: "",
            challenges_solved: 0,
            expertise: 0,
            fields: [],
          },
          field: "",
          value: 0,
          errMessage: "",
          hacker_id: -1,
        });
        document.getElementById("fieldedit").value = "";
        document.getElementById("fieldvalueedit").value = "";
        document.getElementById("hackernameedit").value = "";
        document.getElementById("challengessolvededit").value = "";
        document.getElementById("expertiseedit").value = "";
        alert(this.state.resMessage);
        this.getAllHackers();
      }
    } catch (err) {
      await this.setState({
        hackerData: {
          hacker_name: "",
          challenges_solved: 0,
          expertise: 0,
          fields: [],
        },
        field: "",
        value: 0,
        errMessage: err.message,
        resMessage: "Caught Error : Reload the Page",
        hacker_id: -1,
      });
    }
  }

  async handleDeleteHacker(e) {
    e.preventDefault();
    try {
      const delete_hacker_url = URL.DeleteHackerURL + this.state.hacker_id;
      const response = await fetch(delete_hacker_url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.token,
        },
      });
      const data = await response.json();

      if (data.status !== "success") {
        await this.setState({
          resMessage: data.message,
        });
      } else {
        await this.setState({
          resMessage: data.message,
          hacker_id: -1,
        });
        alert(this.state.resMessage);
        this.getAllHackers();
      }
    } catch (err) {
      await this.setState({
        resMessage: "Caught Error : Reload the Page",
        hacker_id: -1,
      });
    }
  }

  getErrorMessage = () => {
    if (this.state.errMessage !== "") {
      return (
        <div className="row alert alert-danger login__text" role="alert">
          {this.state.errMessage}
        </div>
      );
    } else {
      return null;
    }
  };

  getResponseMessage = () => {
    if (this.state.resMessage !== "") {
      return (
        <div className="row alert alert-info login__text" role="alert">
          {this.state.resMessage}
        </div>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <Container component="main" maxWidth="xs" className="login">
        <CssBaseline />
        {this.state.loggedIn ? (
          <>
            <div className="row alert alert-success login__text" role="alert">
              You are Successsfully Logged in !
            </div>

            <div className="row login__buttons">
              {this.state.option === 0 ? (
                <button
                  type="button"
                  className="btn btn-success login__options"
                  id="add"
                  onClick={this.handleOptionsAdd}
                >
                  Add new Hacker
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-success login__options"
                  id="add"
                  onClick={this.handleOptionsAdd}
                >
                  Add new Hacker
                </button>
              )}

              {this.state.option === 1 ? (
                <button
                  type="button"
                  className="btn btn-info login__options"
                  onClick={this.handleOptionsEdit}
                >
                  Edit Hacker details
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-info login__options"
                  onClick={this.handleOptionsEdit}
                >
                  Edit Hacker details
                </button>
              )}

              {this.state.option === 2 ? (
                <button
                  type="button"
                  className="btn btn-danger login__options"
                  onClick={this.handleOptionsDelete}
                >
                  Delete Hacker
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-danger login__options"
                  onClick={this.handleOptionsDelete}
                >
                  Delete Hacker
                </button>
              )}

              {this.state.option === 3 ? (
                <button
                  type="button"
                  className="btn btn-secondary login__options"
                  onClick={this.viewTopVotes}
                >
                  View Votes
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-secondary login__options"
                  onClick={this.viewTopVotes}
                >
                  View Votes
                </button>
              )}
            </div>

            {this.state.option === 0 ? (
              <div className="row">
                <p className="mx-auto h3 login__title">Add New Hacker</p>
                {this.getErrorMessage()}
                {this.getResponseMessage()}

                <form className="login__form" noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="hackername"
                        label="Hacker's Name"
                        name="hackername"
                        onChange={this.handleHackernameChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="challengessolved"
                        label="Challenges Solved"
                        name="challengessolved"
                        onChange={this.handleChallengesChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="expertise"
                        label="Expertise Level"
                        name="expertise"
                        onChange={this.handleExpertiseChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <p className="h3"> Expert in:</p>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="field"
                        label="Field"
                        name="field"
                        onChange={this.handleFieldChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="fieldvalue"
                        label="Level"
                        name="fieldvalue"
                        onChange={this.handleFieldValueChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}></Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="login__submit"
                        onClick={this.handleAddingField}
                      >
                        Add Field
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}></Grid>
                    <Grid item xs={12}>
                      <ul>
                        {this.state.hackerData.fields.map((i) => {
                          return (
                            <li className="h4 text-center">
                              {i.field} : {i.level}
                            </li>
                          );
                        })}
                      </ul>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="login__submit"
                        onClick={this.handleAddHacker}
                      >
                        Add Hacker
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            ) : null}

            {this.state.option === 1 ? (
              <div className="row">
                <p className="mx-auto h3 login__title">Edit Hacker Details</p>
                {this.getErrorMessage()}
                {this.getResponseMessage()}
                <select
                  id="select_hacker"
                  className="custom-select login__select"
                  onChange={this.getHackerId}
                >
                  <option key="-1">None</option>
                  {this.state.hackers.map((i) => {
                    return (
                      <option value={i.id} key={i.id}>
                        {i.hacker_name}
                      </option>
                    );
                  })}
                </select>
                <form className="login__form" noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="hackernameedit"
                        label="Hacker's Name"
                        name="hackername"
                        onChange={this.handleHackernameChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="challengessolvededit"
                        label="Challenges Solved"
                        name="challengessolved"
                        onChange={this.handleChallengesChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="expertiseedit"
                        label="Expertise Level"
                        name="expertise"
                        onChange={this.handleExpertiseChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <p className="h3"> Expert in:</p>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="fieldedit"
                        label="Field"
                        name="field"
                        onChange={this.handleFieldChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="fieldvalueedit"
                        label="Level"
                        name="fieldvalue"
                        onChange={this.handleFieldValueChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}></Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="login__submit"
                        onClick={this.handleAddingFieldEdit}
                      >
                        Add Field
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}></Grid>
                    <Grid item xs={12}>
                      <ul>
                        {this.state.hackerData.fields.map((i, index) => {
                          return (
                            <li className="h4 text-center" key={index}>
                              {i.field} : {i.level} &#10006;
                            </li>
                          );
                        })}
                      </ul>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="login__submit"
                        onClick={this.handleEditHacker}
                      >
                        Edit Hacker
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            ) : null}

            {this.state.option === 2 ? (
              <div className="row">
                <p className="mx-auto h3 login__title">Delete Hacker</p>
                {this.getErrorMessage()}
                {this.getResponseMessage()}
                <select
                  id="select_hacker_id"
                  className="custom-select login__select"
                  onChange={this.getOnlyHackerId}
                >
                  <option key="-1">None</option>
                  {this.state.hackers.map((i) => {
                    return (
                      <option value={i.id} key={i.id}>
                        {i.hacker_name}
                      </option>
                    );
                  })}
                </select>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="login__submit"
                  onClick={this.handleDeleteHacker}
                >
                  Confirm Delete
                </Button>
              </div>
            ) : null}

            {this.state.option === 3 ? (
              <div className="login__votes">
                <p className="row h3 login__votes-title">
                  {" "}
                  Hackers Ranked by Votes{" "}
                </p>
                {this.state.hackers
                  .sort((a, b) => {
                    let comparison = 0;
                    if (a.votes < b.votes) comparison = 1;
                    else comparison = -1;
                    return comparison;
                  })
                  .map((i) => {
                    return (
                      <div className="row card login__votes-card" key={i.id}>
                        <div className="card-body h4">
                          <p className="text-left">{ i.hacker_name }</p>
                          <p className="text-info text-right">Votes: { i.votes }</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : null}
          </>
        ) : (
          <div className="login__paper">
            <Avatar className="login__avatar">
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>

            {this.state.message !== "" ? (
              <div className="row alert alert-danger login__text" role="alert">
                {this.state.message}
              </div>
            ) : null}

            <form className="login__form" noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={this.handleUsernameChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.handlePasswordChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="login__submit"
                onClick={this.handleLogin}
              >
                Login
              </Button>
            </form>
          </div>
        )}
      </Container>
    );
  }
}
