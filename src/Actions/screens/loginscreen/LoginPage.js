import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./LoginPage.css";
import MainScreen from "../../components/mainscreen/MainScreen";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../Actions/userAction";
import { useHistory } from "react-router";

const LoginPage = () => {
  //for functionality we  use useState to store email, password

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const history = useHistory();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);

  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      history.push("/mynotes");
    }
  }, [history, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    dispatch(login(email, password));
  };
  return (
    <MainScreen title="LOGIN">
      <div className="logincontainer">
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}

        {loading && <Loading />}
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setemail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            New Customer ? <Link to="/register">Register Here</Link>
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default LoginPage;
