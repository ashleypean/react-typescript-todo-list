import React, { useState, useEffect, useRef, useReducer } from 'react';

interface ActionType {
  add: string, 
  complete: string, 
  delete: string, 
  populate: string,
  changeStatus: string, 
}

interface Todo {
  text: string, 
  completed: boolean,
}

interface ActionObject {
  type: string, 
  idx: number | null,
  text?: string,
  initialState?: Todo[] 
}

const actions: ActionType = {
  add: 'add-todo', 
  complete: 'complete-todo', 
  delete: 'delete-todo', 
  populate: 'populate-todos',
  changeStatus: 'change-completed-status',
}

//action reducer
const reducer = (state: Todo[], action: ActionObject) => {
  switch(action.type) {
    case 'add-todo': 
      const newTodo: Todo = {text: action.text as string, completed: false}
      const newState = state.concat([newTodo])
      return newState
    case 'complete-todo': 
      return state 
    case 'delete-todo': 
      return state
    case 'populate-todos': 
      const populatedState: Todo[] = action.initialState as Todo[]
      return populatedState
    case 'change-completed-status': 
      return state
    default: 
      return state
  }
}

const initialState: Todo[] = [
  { text: 'Wash car', completed: false }, 
  { text: 'Clean dishes', completed: true },
]

const App: React.FC = () => {
  const [textInput, setTextInput] = useState('')
  const [list, dispatch] = useReducer(reducer , initialState)
  const inputRef= useRef<HTMLInputElement>(null)


  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value)
  }

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch({type: actions.add, idx: null, text: textInput})
    console.log(inputRef)
  }

  const deleteTodo = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.target
  }

  useEffect( () => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(res => res.json())
      .then(res => res.slice(0, 10))
      .then(list => {
        return list.reduce((acc: Todo[], val: any) => acc.concat({text: val.title, completed: val.completed}), [])
      })
      .then(list => dispatch({type: actions.populate, idx: null, initialState: list}))
  }, [])

  return (
    <div>
      <h1> TODO List</h1>

      <form onSubmit={submitForm}>
        <input type='text'ref={inputRef} onChange={handleTextInput}/>
        <button type='submit'>Submit</button>
      </form>

      <div>
        <h3>To Complete</h3>
        <ul>
          {list.filter(item => !item.completed).map((item, idx) => (
            <li key={idx}>{item.text} 
              <button id={`trash${idx}1`} onClick={deleteTodo}>🗑</button>
              <button id={`complete${idx}`}>Complete</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Completed</h3>
        <ul>
        {list.filter(item => item.completed).map((item, idx) => (
            <li key={idx}>{item.text} 
              <button id={`trash${idx}2`} onClick={deleteTodo}>🗑</button>
              <button id={`incomplete${idx}`} >Incomplete</button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default App;
