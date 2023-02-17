import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { ADDRESS } from "../genericFiles/constants";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import { createTheme } from "@material-ui/core/styles";
import copyright from "../genericFiles/copyright";
import { validateForm } from "../genericFiles/validateForm";
import PopUp from "../genericFiles/PopUp";
import SpinnerDialog from "../genericFiles/SpinnerDialog";
import { Alert } from "react-bootstrap";


const theme = createTheme();

const avatar = {
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
};
const paper = {
  marginTop: theme.spacing(7),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const form = {
  width: "100%", // Fix IE 11 issue.
  marginTop: theme.spacing(3),
};
const submit = {
  margin: theme.spacing(3, 0, 2),
};

class registerHospital extends Component {
  constructor(props) {
    localStorage.clear();
    super(props);
    this.state = {
      name: "",
      address: "",
      userName: "",
      password: "",
      phone: "",
      registrationId: "",
      type: "Hospital",
      SMSUpdates: false,
      isRegistered: false,
      errors: {},
      alertShow: false,
      alertData: "",
      alertHeading: "",
      loaded: false,
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleCheckBox = (event) => {
    this.setState({
      [event.target.name]: event.target.checked,
    });
  };

  submitForm = async (event) => {
    event.preventDefault();
    console.log(this.state);
    let errors = validateForm(this.state);
    console.log(!errors["userName"]);

    if (!errors["userName"]) {
      let isUserNameTaken = localStorage.getItem(this.state.userName);
      console.log(isUserNameTaken);
      if (isUserNameTaken !== null) {
        errors["userName"] = "*userName already taken";
      }
    }
    if (!errors["registrationId"]) {
      let isRegistrationIdTaken = localStorage.getItem(
        this.state.registrationId
      );
      console.log(isRegistrationIdTaken);
      if (isRegistrationIdTaken !== null) {
        errors["registrationId"] = "*registrationId already in use";
      }
    }

    this.setState({ errors: errors });
    this.state.errors = errors;
    this.removeNonNecessaryErrors();
    console.log(this.state.errors);
    let isInvalid = Object.getOwnPropertyNames(this.state.errors).length;
    if (!isInvalid) {
      let response = "";
      try {
        this.setState({ loaded: true });
        response = await axios.post(ADDRESS + `registerHospital`, this.state);
        this.setState({ loaded: false });
        response = response.data;
        console.log(response);
        if (response === "Correct") {
          localStorage.setItem(this.state.registrationId, this.state.name);
          localStorage.setItem(this.state.userName, this.state.name);
          this.setState({ isRegistered: true });
          console.log(this.state);
        } else {
          this.setState({
            alertShow: true,
            alertData: response,
            alertHeading: "SigUp Error",
          });
        }
      } catch (e) {
        this.setState({
          loaded: false,
          alertShow: true,
          alertHeading: "Server Error",
          alertData: "Can not connect to the server",
        });
      }
    }
  };

  render() {
    if (this.state.isRegistered === true) {
      return <Redirect to="/hospitalLogin" />;
    } else {
      const ifalert = this.state.alertShow;
      return (
        // <Container component="main" maxWidth="xs">
        //   <PopUp
        //     alertData={this.state.alertData}
        //     alertHeading={this.state.alertHeading}
        //     alertShow={this.state.alertShow}
        //     alertCloseFunc={() => this.setState({ alertShow: false })}
        //   />
        //   <CssBaseline />
        //   <div style={paper}>
        //     <Avatar style={avatar}>
        //       <LockOutlinedIcon />
        //     </Avatar>
        //     <Typography component="h1" variant="h5">
        //       Hospital SignUp
        //     </Typography>
        //     <form style={form} noValidate onSubmit={this.submitForm}>
        //       <Grid container spacing={2}>
        //         <Grid item xs={12}>
        //           <TextField
        //             autoComplete="name"
        //             name="name"
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="name"
        //             label="Hospital Name"
        //             defaultValue={this.state.name}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.name}
        //             autoFocus={true}
        //           />
        //         </Grid>

        //         <Grid item xs={12} sm={6}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="phone"
        //             label="Phone No."
        //             name="phone"
        //             autoComplete="phone"
        //             defaultValue={this.state.phone}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.phone}
        //           />
        //         </Grid>

        //         <Grid item xs={12} sm={6}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="registrationId"
        //             label="Registration No"
        //             name="registrationId"
        //             autoComplete="45454545455"
        //             defaultValue={this.state.registrationId}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.registrationId}
        //           />
        //         </Grid>
        //         <Grid item xs={12}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="address"
        //             label="Address"
        //             name="address"
        //             autoComplete="India"
        //             defaultValue={this.state.address}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.address}
        //           />
        //         </Grid>
        //         <Grid item xs={12}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="userName"
        //             label="UserName"
        //             name="userName"
        //             autoComplete="userName"
        //             defaultValue={this.state.userName}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.userName}
        //           />
        //         </Grid>
        //         <Grid item xs={12}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             name="password"
        //             label="Password"
        //             type="password"
        //             id="password"
        //             autoComplete="current-password"
        //             defaultValue={this.state.password}
        //             helperText={this.state.errors.password}
        //             onChange={this.handleChange}
        //           />
        //         </Grid>
        //         <Grid item xs={12}>
        //           <FormControlLabel
        //             control={
        //               <Checkbox
        //                 name="SMSUpdates"
        //                 defaultValue={this.state.SMSUpdates}
        //                 checked={this.state.SMSUpdates}
        //                 onChange={this.handleCheckBox}
        //                 color="primary"
        //               />
        //             }
        //             label="I want to receive information and updates via sms."
        //           />
        //         </Grid>
        //       </Grid>
        //       <Button
        //         type="submit"
        //         fullWidth
        //         variant="contained"
        //         color="primary"
        //         style={submit}
        //       >
        //         Sign Up
        //       </Button>
        //       <Grid container>
        //         <Grid item xs>
        //           <Link href="/" variant="body2">
        //             Home Page
        //           </Link>
        //         </Grid>
        //         <Grid item>
        //           <Link href="/hospitalLogin" variant="body2">
        //             Already have an account? Sign in
        //           </Link>
        //         </Grid>
        //       </Grid>
        //     </form>
        //   </div>
        //   <Box mt={5}>
        //     <copyright.Copyright />
        //   </Box>
        //   <SpinnerDialog open={this.state.loaded} />
        // </Container>
        <div id="main-wrapper">  
        <section className="h-100 bg-secondary" style={{display: "flex"}}>
          <div className="container  h-100" >
            <div className="row d-flex justify-content-center align-items-center h-80">
              <div className="col">
                <div className="card card-registration my-4" style={{borderRadius: "25px"}}>
                  <div className="row g-0">
                    <div className="col-xl-6 d-none d-xl-block">
                      <img src="https://images.pexels.com/photos/9741531/pexels-photo-9741531.jpeg?auto=compress&cs=tinysrgb&h=800&scale.option=fill"
                        alt="photo" className="img-fluid"
                        style={{ borderRadius: "25px"}} />
                    </div>
                    <div className="col-xl-6" >
                      <form noValidate onSubmit={this.submitForm}>
                        <div className="card-body p-md-5 text-black">
                          <h3 className="mb-5 text-uppercase">Hospital Registration Form</h3>
                          {/* ALL alerts and errors in the form */}
                          {ifalert ? (<Alert variant="danger"> {this.state.alertHeading}  {this.state.alertData} </Alert>):(<></>)}
                          {this.state.errors.name ? (<Alert variant="danger">{this.state.errors.name}</Alert>) : (<></>)}
                          {this.state.errors.address ? (<Alert variant="danger">{this.state.errors.address}</Alert>) : (<></>)}
                          {this.state.errors.phone ? (<Alert variant="danger">{this.state.errors.phone}</Alert>) : (<></>)}
                          {this.state.errors.registrationId ? (<Alert variant="danger">{this.state.errors.registrationId}</Alert>) : (<></>)}
                          {this.state.errors.userName ? (<Alert variant="danger">{this.state.errors.userName}</Alert>) : (<></>)}
                          {this.state.errors.password ? (<Alert variant="danger">{this.state.errors.password}</Alert>) : (<></>)}
                    
                          <div className="row">
                            <div className="d-md-flex justify-content-start align-items-">
                              <div className="form-outline">

                                <label className="form-label" htmlFor="name">Hospital Name</label>

                                <input required type="text" name="name" id="name" defaultValue={this.state.name}
                                  onChange={this.handleChange} className="form-control " />
                              </div>
                            </div>

                          <div className="row">
                            <div className="d-md-flex justify-content-start align-items-">
                              <div className="form-outline">
                                <label className="form-label" htmlFor="phone">Contact No.</label>

                                <input required type="text" id="phone" name="phone" defaultValue={this.state.phone} helperText={this.state.errors.phone}
                                  onChange={this.handleChange} className="form-control " />
                              </div>
                            </div>
                          </div>
                          
                          <div className="d-md-flex justify-content-start align-items-center">
                            <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="address">Address</label>

                            <input type="text" id="address" name="address" defaultValue={this.state.address} helperText={this.state.errors.address}
                              onChange={this.handleChange} className="form-control " />
                            </div>
                          </div>
                          <div className="d-md-flex justify-content-start align-items-center">
                            <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="registrationId">Registration ID</label>

                            <input type="text" id="registrationId" name="registrationId" defaultValue={this.state.registrationId} helperText={this.state.errors.address}
                              onChange={this.handleChange} className="form-control " />
                            </div>
                          </div>

                          <div className="form-outline mb-4 col-md-8">
                            <label className="form-label" fhtmlFor="userName">Username</label>

                            <input type="text" id="userName"
                              label="UserName"
                              name="userName" defaultValue={this.state.userName} helperText={this.state.errors.userName}
                              onChange={this.handleChange} className="form-control " />
                          </div>

                          <div className="form-outline mb-4 col-md-8">
                            <label className="form-label" fhtmlFor="password">Password</label>

                            <input type="password" defaultValue={this.state.password}
                              label="Password" className="form-control "
                              onChange={this.handleChange} name="password"
                              id="password" helperText={this.state.errors.password}
                            />
                          </div>



                          <div className="d-flex justify-content-start pt-3">
                            {/* <button type="button" className="btn btn-light btn-lg">Reset all</button> */}
                            <Button type="submit" variant="contained" color="primary" >Submit</Button>
                          </div>

                        </div>
                      </div>
                      </form>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Box mt={5}>
              <copyright.Copyright />
            </Box>
            <SpinnerDialog open={this.state.loaded} />
          </div>
        </section>
      </div>

      );
    }
  }

  removeNonNecessaryErrors = (event) => {
    delete this.state.errors.bloodGroup;
    delete this.state.errors.medicalRegistrationNo;
    delete this.state.errors.lastName;
    delete this.state.errors.firstName;
    delete this.state.errors.aadhaar;
    delete this.state.errors.DOB;
    delete this.state.errors.specialisation;
    delete this.state.errors.firstName;
    delete this.state.errors.gender;
    delete this.state.errors.hospitalId;
  };
}

export default registerHospital;
