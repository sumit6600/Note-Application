import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/mainscreen/MainScreen";
import Loading from "../../components/Loading";
import { register } from "../../Actions/userAction";
import Fade from "react-reveal";

import { useDispatch, useSelector } from "react-redux";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pic, setPic] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [picMessage, setPicMessage] = useState(null);

  const dispatch = useDispatch();
  const history = useHistory();

  const userRegister = useSelector((state) => state.userRegister);

  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      history.push("/mynotes");
    }
  }, [history, userInfo]);

  const SubmitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setMessage("passwords do not match");
    } else {
      dispatch(register(name, email, password, pic));
    }
  };

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

  return (
    <MainScreen title="REGISTER">
      <div className="registorcontainer">
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
        {loading && <Loading />}
        <Form onSubmit={SubmitHandler}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="Name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Fade bottom collapse when={name}>
              <div className="invalid-Name" style={{ display: "block" }}>
                Min. 4 character
              </div>
            </Fade>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasiConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="Confirmpassword"
              placeholder="ConfirmPassword"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          {picMessage && (
            <ErrorMessage variant="danger">{picMessage}</ErrorMessage>
          )}

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => postDetail(e.target.files[0])}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            REGISTER
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            Have an Account ? <Link to="/login">Login</Link>
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default RegisterPage;
