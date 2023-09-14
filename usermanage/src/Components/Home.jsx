import React, { useEffect, useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import DataTable from "react-data-table-component";
import "../Styles/Home.css";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [showBlade, setShowBlade] = useState(false);
  const [isEdittableOn, setIsEdittableOn] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "",
    state: "",
    city: "",
  });

  const [error, setError] = useState("");
  const [userDataBlade, setuserDataBlade] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [userData, setUserData] = useState([]);

  const handleInputChange = (e) => {
    console.log(e, "onchangeinput");
    const { name, value } = e.target;

    
    setFormData({ ...formData, [name]: value });
  };

  const addUser = () => {
    if (!validateEmail(formData.email)) {
      setError("Invalid email address.");
      return;
    }

    if (
      userDataBlade.some((user) => user.email === formData.email) ||
      userData.some((user) => user.email === formData.email)
    ) {
      setError("Email already exists.");
      return;
    }

    setuserDataBlade([...userDataBlade, formData]);
    setFormData({
      name: "",
      email: "",
      mobile: "",
      country: "",
      state: "",
      city: "",
    });
    setError("");
  };

  //remove user from temp users
  const removeUser = (email) => {
    const updatedData = userDataBlade.filter((user) => user.email !== email);
    setuserDataBlade(updatedData);
  };

  //   email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  //checking User is Loggedin or not
  useEffect(() => {
    const UserLoggedIn = Cookies.get("token");
    UserLoggedIn === undefined && navigate("/login");
    console.log(UserLoggedIn, "userloginstatus");

    axios
      .get("https://vinoapi.winayak.com/api/core/countries?keyword")
      .then((res) => {
        console.log(res.data.list, "countrylist");
        setCountryList(res.data.list);
      })
      .catch((error) => {
        console.log(error, "countrylist");
      });


  }, []);

  useEffect(()=>{

    const countryID = countryList.find(el=> el?.name === formData?.country)?.id

    console.log(countryID, "countryid")

    axios
    .get(`https://vinoapi.winayak.com/api/core/states?country_id=${countryID}`)
    .then((res) => {
      console.log(res.data.list, "StateList");
      setStateList(res.data.list);
    })
    .catch((error) => {
      console.log(error, "countrylist");
    });

  }, [formData])

  //logout function
  const logoutUser = (e) => {
    e.preventDefault();
    Cookies.remove("token");
    Cookies.remove("status");
    navigate("/login");
  };

  // edit mode
  const ShowBlade = (row) => {
    console.log(row, "rowData");
    setIsEdittableOn(true);
    setFormData(row);
    bladeFunction();
  };

  console.log(userData, "userData");
  console.log(userDataBlade, "userDataBlade");
  console.log(formData, "formData");

  function bladeFunction() {
    if (showBlade == false) {
      setShowBlade(true);
    } else {
      setShowBlade(false);
      setuserDataBlade([]);
    }
  }

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
    },
    {
      name: "City",
      selector: (row) => row.city,
    },
    {
      name: "State",
      selector: (row) => row.state,
    },
    {
      name: "Country",
      selector: (row) => row.country,
    },
    {
      name: "Action",
      cell: (row) => {
        return (
          <button onClick={() => ShowBlade(row)}>
            Edit <i class="fa fa-pencil"></i>
          </button>
        );
      },
    },
  ];

  //new user added
  const SubmitData = (e) => {
    setUserData([...userData, ...userDataBlade]);
    setuserDataBlade([]);
    bladeFunction();
    setFormData({
      name: "",
      email: "",
      mobile: "",
      country: "",
      state: "",
      city: "",
    });
    setError("");
  };

  //new user added
  const updateuser = (e) => {
    const updatedata = [formData];
    const olduserlist = userData.filter((el) => el.email !== formData.email);
    setUserData([...olduserlist, ...updatedata]);
    setuserDataBlade([]);
    bladeFunction();
    setIsEdittableOn(false)
    setFormData({
      name: "",
      email: "",
      mobile: "",
      country: "",
      state: "",
      city: "",
    });
    setError("");
  };

  return (
    <div className="HomePage">
      <div className="HomePage_Header">
        <h2 className="HomePage_Logo">Task Manager</h2>
        <button className="HomePage_Logout" onClick={logoutUser}>
          Logout
        </button>
      </div>
      <div className="HomePage_UserTable">
        <div className="HomePage_TableTitle_button">
          <h3 className="HomePage_TableTitle">User Table</h3>
          <button className="HomePage_TableAddUser" onClick={bladeFunction}>
            Add User
          </button>
        </div>
        <div className="HomePage_TableContainer">
          <DataTable columns={columns} data={userData} />
        </div>
      </div>

      {showBlade && (
        <div className="Blade_AddUser">
          <div className="Blade_Title">
            {isEdittableOn ? <h2>Update User</h2> : <h2>Add User</h2>}
            <div onClick={bladeFunction}>
              <i className="fa fa-close"></i>
            </div>
          </div>
          <div>
            <form className="Blade_AddUserInput">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="Blade_input"
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="Blade_input"
                  required
                />
              </div>
              <div>
                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="Blade_input"
                  required
                />
              </div>
              <div>
                <label>Country</label>

                <select
                  name="country"
                  value={formData.country}
                  onChange={(e)=>handleInputChange(e)}
                  className="Blade_input"
                >
                  <option>Please choose Country</option>
                  {countryList.map((option, index) => {
                    return (
                      <option key={index} value={option.name}>
                        {option?.name}
                      </option>
                    );
                  })}
                </select>
                {/* <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="Blade_input"
                  required
                /> */}
              </div>
              <div>
                <label>State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={(e)=>handleInputChange(e)}
                  className="Blade_input"
                >
                  <option>Please choose State</option>
                  {stateList.map((option, index) => {
                    return (
                      <option key={option.id} value={option.name}>
                        {option?.name}
                      </option>
                    );
                  })}
                </select>
                {/* <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="Blade_input"
                  required
                /> */}
              </div>
              <div>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="Blade_input"
                  required
                />
              </div>
              {isEdittableOn ? (
                <button type="button" onClick={updateuser}>
                  Update User
                </button>
              ) : (
                <button type="button" onClick={addUser}>
                  Add User
                </button>
              )}
              <p className="error">{error}</p>
            </form>
          </div>
          <div>
            {userDataBlade?.length > 0 && <h4>New Added Users</h4>}
            <ul>
              {userDataBlade.map((user) => (
                <li key={user.email}>
                  {user.name} - {user.email} -{user.country}
                  <button onClick={() => removeUser(user.email)}>
                    {" "}
                    Remove{" "}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {userDataBlade?.length > 0 && (
            <div>
              <button onClick={SubmitData}>Save</button>
              <button onClick={bladeFunction}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
