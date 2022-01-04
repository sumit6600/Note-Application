import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { deleteNoteAction, updateNoteAction } from "../../Actions/noteAction";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/mainscreen/MainScreen";
import axios from "axios";

function SingleNote({ history, match }) {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [category, setCategory] = useState();
  const [date, setdate] = useState("");

  const dispatch = useDispatch();
  const noteUpdate = useSelector((state) => state.noteUpdate);
  const { loading, error } = noteUpdate;

  const noteDelete = useSelector((state) => state.noteDelete);
  const { loading: loadingDelete, error: errorDelete } = noteDelete;
  //   console.log(note);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteNoteAction(id));
    }
    history.push("/mynotes");
  };

  useEffect(() => {
    const fetchdata = async () => {
      const { data } = await axios.get(`/api/notes/${match.params.id}`);
      setTitle(data.title);
      setdate(data.updatedAt);
      setCategory(data.category);
      setContent(data.content);
    };

    fetchdata();
  }, [match.params.id, date]);

  const resetHandler = () => {
    setTitle("");
    setCategory("");
    setContent("");
  };

  const updateHandler = (e) => {
    e.preventDefault();

    if (!title || !content || !category) return;

    dispatch(updateNoteAction(match.params.id, title, content, category));

    resetHandler();

    history.push("/mynotes");
  };

  return (
    <>
      <MainScreen title="Edit Note">
        <Card>
          <Card.Header>Edit Note</Card.Header>
          <Card.Body>
            <Form onSubmit={updateHandler}>
              {loadingDelete && <Loading />}
              {errorDelete && (
                <ErrorMessage variant="danger">{error}</ErrorMessage>
              )}
              {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="title"
                  value={title}
                  placeholder="Enter the title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="content">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  value={content}
                  placeholder="Enter the content"
                  rows={4}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Form.Group>

              {content && (
                <Card>
                  <Card.Header>Note Preview</Card.Header>
                  <Card.Body>
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </Card.Body>
                </Card>
              )}
              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="content"
                  value={category}
                  placeholder="Enter the Category"
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Form.Group>
              {loading && <Loading size={50} />}
              <Button type="submit" variant="primary">
                Update Note
              </Button>
              <Button
                className="mx-2"
                variant="danger"
                onClick={() => deleteHandler(match.params.id)}
              >
                Delete Note
              </Button>
            </Form>
          </Card.Body>

          <Card.Footer className="text-muted">
            updated on - {new Date().toLocaleDateString()}
          </Card.Footer>
        </Card>
      </MainScreen>
    </>
  );
}

export default SingleNote;
