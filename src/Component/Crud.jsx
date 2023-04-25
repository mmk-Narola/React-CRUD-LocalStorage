import { useState, useEffect } from "react";

const Crud = () => {
  const [task, setTask] = useState({
    name: "",
    email: "",
    task: "",
  });
  const [listTask, setListTask] = useState([]);
  const [editId, setEditId] = useState("");
  const [flag, setFlag] = useState(false);
  const [searchTask, setSearchTask] = useState("");
  const [searchValue, setSearchValue] = useState(listTask);

  // get Input Field Value
  const handleChange = (e) => {
    const { name, value } = e.target;
    const date = new Date();
    const uId = date.getTime() + Math.floor(Math.random() * 10) + 1;
    let objTask = {
      id: uId,
      [name]: value,
    };

    setTask({
      ...task,
      ...objTask,
    });
  };

  //Add Task
  const handleSubmit = (e) => {
    e.preventDefault();

    // Add Task in LocalStorage
    const getTaskList = JSON.parse(localStorage.getItem("taskList"));
    const taskList = getTaskList !== null ? getTaskList : [];
    taskList.push(task);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    setListTask(taskList);
    setTask({
      name: "",
      email: "",
      task: "",
    });
    setSearchValue(taskList);
    setFlag(false);
  };

  //   Edit Task
  const handleEdit = (id) => {
    console.log(id);
    const findUser = listTask.find((item) => item.id === id) || null;
    console.log(findUser);
    if (findUser) {
      setTask((prev) => ({
        ...prev,
        ...findUser,
      }));
    }
    setEditId(id);
    setFlag(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log(editId);
    setListTask(
      listTask.map((editList) => {
        return editList.id === editId ? { ...editList, ...task } : editList;
      })
    );

    let data = JSON.parse(localStorage.getItem("taskList"));
    const updateValue = data.map((newValue) => {
      if (newValue.id === editId) {
        return {
          ...newValue,
          name: task.name,
          email: task.email,
          task: task.task,
        };
      }
      return newValue;
    });
    localStorage.setItem("taskList", JSON.stringify(updateValue));

    setSearchValue(
      listTask.map((editList) => {
        return editList.id === editId ? { ...editList, ...task } : editList;
      })
    );

    setTask({
      name: "",
      email: "",
      task: "",
    });
    setFlag(false);
  };

  //   Delete Task
  const handleDelete = (id) => {
    console.log(id);
    const filterList = listTask.filter((list) => list.id !== id);
    console.log(filterList);
    localStorage.setItem("taskList", JSON.stringify(filterList));
    setListTask(filterList);
    setSearchValue(filterList);
  };

  const handleBack = () => {
    setTask({
      name: "",
      email: "",
      task: "",
    });
    setFlag(false);
  };

  const onSearch = (e) => {
    console.log(e.target.value);
    setSearchTask(e.target.value);
  };

  //get list from rendring
  useEffect(() => {
    const getTodo = JSON.parse(localStorage.getItem("taskList"));
    console.log(getTodo);
    setListTask(getTodo || []);
    setSearchValue(getTodo);
  }, []);

  useEffect(() => {
    if (searchTask) {
      // const searchList = listTask.filter(
      //   (item) => item.name.toLowerCase().indexOf(searchTask.toLowerCase()) > -1
      // );
      const searchList = listTask.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchTask.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTask.toLowerCase()) ||
          item.task.toLowerCase().includes(searchTask.toLowerCase())
        );
      });
      console.log("List", searchList);
      setSearchValue(searchList);
      // if (searchList.length > 0) {
      //   setSearchValue(searchList);
      // }
    } else {
      setSearchValue(listTask);
    }
  }, [searchTask, listTask]);

  return (
    <>
      <div className="search-field">
        <input
          type="text"
          placeholder="Search....."
          value={searchTask}
          onChange={(e) => onSearch(e)}
        />
      </div>
      <div className="mainContainer">
        <div className="left-side">
          Task List
          <div className="backBtn">
            {flag && (
              <button onClick={() => handleBack()} className="btn btn-success">
                <i className="bi bi-backspace-fill"></i>
              </button>
            )}
          </div>
          <form>
            <input
              type="text"
              value={task.name}
              onChange={(e) => handleChange(e)}
              name="name"
              placeholder="Name..."
            />
            <input
              type="text"
              value={task.email}
              onChange={(e) => handleChange(e)}
              name="email"
              placeholder="Email..."
            />

            <input
              type="text"
              value={task.task}
              onChange={(e) => handleChange(e)}
              name="task"
              placeholder="Task..."
            />

            <button
              className="btn btn-primary "
              disabled={!task.name || !task.email || !task.task}
              onClick={flag ? handleUpdate : handleSubmit}
            >
              {flag ? "Update" : "Add"}
            </button>
          </form>
        </div>

        <div className="right-side">
          <table className="table text-center">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Task</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchValue.length > 0 ? (
                searchValue.map((taskItem) => {
                  return (
                    <tr key={taskItem.id}>
                      <td>{taskItem.name}</td>
                      <td>{taskItem.email}</td>
                      <td>{taskItem.task}</td>
                      <td style={{ width: "150px" }}>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEdit(taskItem.id)}
                          style={{ marginRight: "10px" }}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(taskItem.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4}>Not Task Add</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Crud;
