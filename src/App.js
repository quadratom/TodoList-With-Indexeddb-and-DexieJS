import React from "react";
import "./App.css";

import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

export const db = new Dexie("todoApp");
db.version(1).stores({
  todos: "++id, task, completed", // Primary key and indexed props
});

const {todos} = db

const App = () => {
  // Live query that automatically updates when data changes
  const allItems = useLiveQuery(
    () => todos.toArray(), // query function
    [] // dependency array
  );

  console.log(allItems);
  

  const addTask = async (event) => {
    event.preventDefault();
    const taskField = document.querySelector("#taskinput");
    // console.log(taskField.value); // log the input value

    await todos.add({
      task: taskField['value'],
      complete : false
    })
    taskField.value = ""
  };

  const taskDelete = async (id) => todos.delete(id)

  const toggleStatus = async  (id, event) => {
    await todos.update(id, {complete: !!event.target.checked})
  }

  return (
    <div className="container">
      <h3 className="teal-text center-align">Todo App</h3>
      <form className="add-item-form " onSubmit={addTask}>
        <input
          type="text"
          id="taskinput"
          className="itemField"
          placeholder="What do you want to do today?"
          required
        />
        <button type="submit" className="waves-effect btn teal right">
          Add
        </button>
      </form>

      <div className="card white darken-1">
        <div className="card-content">
          { allItems?.map( ({ id, complete, task}) => ( 
          <div className="row" key={id} >
            <p className="col s10">
              <label>
                <input type="checkbox" checked={complete} 
                className="checkbox-blue"
                onChange={(event: ChangeEvent<HTMLInputElement>) => toggleStatus(id, event)}
                
                />
                <span className={`black-tex ${complete && 'strike-text'}`}>{task}</span>
              </label>
            </p>
            <i className="col s2 material-icons delete-button" onClick={ () => taskDelete(id)} >delete</i>
          </div>
          )) }
        </div>
      </div>
    </div>
  );
};

export default App;
