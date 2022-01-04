import React from "react";
import MainScreen from "../../components/mainscreen/MainScreen";
import { Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useEffect } from "react";
import { useState } from "react";
import ErrorMessage from "../../components/ErrorMessage";
import { updateProfile } from "../../Actions/userAction";
import Loading from "../../components/Loading";
import "./profileScreen.css";
const ProfileScreen = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pic, setPic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picMessage, setPicMessage] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading, error, success } = userUpdate;

  useEffect(() => {
    if (!userInfo) {
      history.push("/");
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPic(userInfo.pic);
    }
  }, [history, userInfo]);

  const postDetail = (pic) => {
    if (!pic) {
      return setMessage("please selesct an image");
    }
    setPicMessage(null);
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "noteapplication");
      data.append("cloud_name", "dmkodlxvi");
      fetch("https://api.cloudinary.com/v1_1/dmkodlxvi/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPic(data.url.toString());
        })
        .catch((error) => {
          console.log(error);
        });
    } else return setPicMessage("Please selest an image");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (password === confirmPassword)
      dispatch(updateProfile({ name, email, password, pic }));
  };
  return (
    <MainScreen title="EDIT PROFILE">
      <div>
        <Row className="profilecontainer">
          <Col
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={pic} alt={name} className="profilePic" />
          </Col>
          <Col md={6}>
            <Form onSubmit={submitHandler}>
              {loading && <Loading />}
              {success && (
                <ErrorMessage variant="success">
                  {" "}
                  Upadted Successfully
                </ErrorMessage>
              )}

              {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}

              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              {picMessage && (
                <ErrorMessage variant="danger">{picMessage}</ErrorMessage>
              )}

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Change Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => postDetail(e.target.files[0])}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                UPDATE
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default ProfileScreen;
